import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { storage, database } from "../../firebase";
import { useAuth } from "../contexts/AuthContexts";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import reactDom from "react-dom";
import { ProgressBar, Toast } from "react-bootstrap";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();
  function handleChange(e) {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;

    const id = uuidV4();

    setUploadingFiles((prevFileUploading) => [
      ...prevFileUploading,
      { id: id, name: file.name, progress: 0, error: false },
    ]);
    console.log("This is file Name " + file.name);
    console.log("This is Current folder" + currentFolder.id);

    const parentPath =
      currentFolder.path.length > 0
        ? `${currentFolder.path.map((e) => e.name).join("/")}`
        : "";

    console.log("This is Paren Path" + parentPath);

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${parentPath}/${file.name}`
        : `${parentPath}/${currentFolder.name}/${file.name}`;

    // console.log("This is file path " + filePath);

    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;

        setUploadingFiles((prevFileUploading) => {
          return prevFileUploading.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }
            return uploadFile;
          });
        });
      },
      () => {
        setUploadingFiles((prevFileUploading) => {
          return prevFileUploading.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
      },
      () => {
        setUploadingFiles((prevFileUploading) => {
          console.log("closing");
          return prevFileUploading.filter((uploadingFile) => {
            return uploadingFile.id !== id;
          });
        });

        // setUploadingFiles((prevFileUploading) => {
        //   return prevFileUploading.filter((uploadFile) => {
        //     return uploadFile.id !== id;
        //   });
        // });
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          // console.log(url);
          database.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then((existingFiles) => {
              const existingFile = existingFiles.docs[0];
              if (existingFile) {
                existingFile.ref.update({ url: url });
              } else {
                database.files.add({
                  url: url,
                  name: file.name,
                  createdAt: database.getCurrentTimestamp(),
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
                });
              }
            });
        });
      }
    );
  }
  return (
    <>
      <label className='btn btn-outline-success m-0 mr-2'>
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type='file'
          onChange={handleChange}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        reactDom.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast key={file.id}>
                <Toast.Header
                  closeButton={file.error}
                  className='text-truncate w-100 d-block'
                  onClick={() => {
                    setUploadingFiles((prevFileUploading) => {
                      return prevFileUploading.filter((uploadFile) => {
                        return uploadFile.id !== file.id;
                      });
                    });
                  }}
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error..!!"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
