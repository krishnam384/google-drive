import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { Link } from "react-router-dom";

export default function FolderBreadCrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  // console.log(path);
  if (currentFolder) {
    path = [...path, ...currentFolder.path];
  }
  return (
    <Breadcrumb
      className='flex-grow-1'
      listProps={{ className: "bg-white pl-0 m-0" }}
    >
      {path.map((folder, index) => (
        <Breadcrumb.Item
          key={folder.id}
          linkAs={Link}
          linkProps={{
            to: {
              pathname: folder.id ? `/folder/${folder.id}` : "/",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            },
          }}
        >
          {folder.name}
        </Breadcrumb.Item>
      ))}
      {currentFolder && <Breadcrumb.Item>{currentFolder.name}</Breadcrumb.Item>}
    </Breadcrumb>
  );
}
