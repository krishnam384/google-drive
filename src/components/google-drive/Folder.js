import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export default function Folder({ folder }) {
  return (
    <Button
      as={Link}
      to={{ pathname: `/folder/${folder.id}`, state: { folder: folder } }}
      variant='outline-dark'
      className='text-truncate w-100'
    >
      <FontAwesomeIcon icon={faFolder} />
      {folder.name}
    </Button>
  );
}
