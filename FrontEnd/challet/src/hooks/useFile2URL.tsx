const useFile2URL = () => {
  const file2URL = async (file: File) => {
    try {
      const api = import.meta.env.VITE_API_URL + '/api/challet/upload';
      const formData = new FormData();
      formData.append('file', file);
      const fileURL = await fetch(api, {
        method: 'POST',
        body: formData,
      }).then((res) => res.text());
      return fileURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return { file2URL };
};

export default useFile2URL;
