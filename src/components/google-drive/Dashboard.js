import React from "react";
import { Container } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";

// Importing Files
import Navbar from "./Navbar";
import AdddFolderButton from "./AdddFolderButton";
import AddFileButton from "./AddFileButton";
import { useFolder } from "../../hooks/useFolder";
import Folder from "./Folder";
import File from "./File";
import FolderBreadCrumbs from "./FolderBreadCrumbs";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(
    folderId,
    state.folder
  );

  // console.log(folder);
  return (
    <>
      <Navbar />
      <Container fluid>
        {folder && (
          <div className='d-flex align-items-center'>
            <FolderBreadCrumbs
              currentFolder={folder}
              style={{ maxWidth: "100px" }}
            />
            <AddFileButton currentFolder={folder} />
            <AdddFolderButton currentFolder={folder} />
          </div>
        )}

        {childFolders.length > 0 && (
          <div className='d-flex flex-wrap '>
            {childFolders.map((childFolder) => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "200px" }}
                className='p-2'
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}

        {childFiles.length > 0 && (
          <div className='d-flex flex-wrap '>
            {childFiles.map((childFile) => (
              <div
                key={childFile.id}
                style={{ maxWidth: "200px" }}
                className='p-2'
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
