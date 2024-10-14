package com.challet.challetservice.domain.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
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
			String uniqueFileName = UUID.randomUUID().toString() + ".webp";
			String fileUrl = "https://" + bucket + "/" + uniqueFileName;

			File tempFile = File.createTempFile("temp", file.getOriginalFilename());
			file.transferTo(tempFile);

			Path webpFilePath = Files.createTempFile("converted", ".webp");
			ImmutableImage.loader()
				.fromFile(tempFile)
				.output(WebpWriter.DEFAULT, webpFilePath.toFile());

			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType("image/webp");
			metadata.setContentLength(Files.size(webpFilePath));

			amazonS3Client.putObject(bucket, uniqueFileName, Files.newInputStream(webpFilePath), metadata);

			tempFile.delete();
			Files.delete(webpFilePath);

			return ResponseEntity.ok(fileUrl);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
		}
	}
}
