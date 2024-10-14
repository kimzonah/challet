package com.challet.challetservice.domain.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/challet/upload")
@RequiredArgsConstructor
public class FileUploadController {

	private final AmazonS3Client amazonS3Client;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	@PostMapping
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			// 고유한 파일명 생성
			String uniqueFileName = UUID.randomUUID().toString() + ".png"; // WebP 대신 PNG 사용
			String fileUrl = "https://" + bucket + "/" + uniqueFileName;

			// 이미지 리사이즈 및 PNG 변환 (thumbnailator 사용)
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			Thumbnails.of(file.getInputStream())
				.size(800, 600) // 원하는 크기로 리사이즈
				.outputFormat("png") // PNG로 변환
				.toOutputStream(outputStream);
			byte[] imageData = outputStream.toByteArray();

			// S3에 업로드할 메타데이터 설정
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType("image/png");  // Content-Type을 PNG로 설정
			metadata.setContentLength(imageData.length);

			// S3에 파일 업로드
			ByteArrayInputStream inputStream = new ByteArrayInputStream(imageData);
			amazonS3Client.putObject(bucket, uniqueFileName, inputStream, metadata);

			return ResponseEntity.ok(fileUrl);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
		}
	}
}
