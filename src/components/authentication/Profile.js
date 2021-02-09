import React, { useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContexts";
import { Link, useHistory } from "react-router-dom";

export default function Profile() {
  const [error, setError] = useState();
  const { currentUser, logOut } = useAuth();
  const history = useHistory();
  async function handleLogOut() {
    try {
      setError("");
      await logOut();
      history.push("/login");
    } catch {
      setError("Failed to Log Out");
    }
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h1 className='text-center mb-4'>Profile</h1>
          {error && <Alert variant='danger'>{error}</Alert>}
          <strong>Email:</strong>
          {currentUser.email}
          <Link
            to='/update-profile'
            className='w-100 text-center btn btn-primary mt-3'
          >
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Button variant='link' onClick={handleLogOut}>
          Log Out
        </Button>
      </div>
    </>
  );
}
