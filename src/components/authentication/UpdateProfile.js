import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContexts";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const history = useHistory();
  function handleSubmit(e) {
    e.preventDefault();

    if (passwordConfirmationRef.current.value !== passwordRef.current.value) {
      return setError("Passwords didnot match");
    }

    const promises = [];
    setIsLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/user");
      })
      .catch(() => {
        setError("Failed to Update");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h1 className='text-center mb-4'>Sign Up</h1>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                ref={emailRef}
                defaultValue={currentUser.email}
              />
            </Form.Group>

            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                ref={passwordRef}
                placeholder='Label the same'
              />
            </Form.Group>

            <Form.Group id='password-confirmation'>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type='password'
                ref={passwordConfirmationRef}
                placeholder='Label the same'
              />
            </Form.Group>

            <Button type='submit' disabled={isLoading} className='w-100'>
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        <Link to='/user'>Cancel</Link>
      </div>
    </CenteredContainer>
  );
}
