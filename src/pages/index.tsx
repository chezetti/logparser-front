import { useState } from "react";

export default function PrivatePage() {
  const [file, setFile] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [infoCount, setInfoCount] = useState(0);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file.name);
      setFile(file);
    }
  };

  const uploadToServer = async (event: any) => {
    const formData = new FormData();
    formData.append("file", file!);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };
    
    fetch("http://localhost:9000/parser", requestOptions)
      .then(response => response.json())
      .then((data) => {
        setErrorCount(data.errorCount);
        setInfoCount(data.infoCount);
      })
      .catch(error => console.log('error', error));
  };

  return (
    <div>
      <div>
        <h4>Select File</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Parse
        </button>
        <p></p>
        <div>Errors: {errorCount}, Infos: {infoCount}</div>
      </div>
    </div>
  );
}
