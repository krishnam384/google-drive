import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContexts";
import { Link } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function Signup() {
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { passwordReset } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      await passwordReset(emailRef.current.value);
      setIsLoading(true);
      setMessage("Please check your Mail for Password Reset Link");
    } catch {
      setError("Failed to Reset Password");
    }
    setIsLoading(false);
  }
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h1 className='text-center mb-4'>Password Reset</h1>
          {error && <Alert variant='danger'>{error}</Alert>}
          {message && <Alert variant='success'>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' required ref={emailRef} />
            </Form.Group>

            <Button type='submit' disabled={isLoading} className='w-100'>
              Reset Password
            </Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/login'>Log In</Link>
          </div>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        Need an account?
        <Link to='/signup'>Sign Up</Link>
      </div>
    </CenteredContainer>
  );
}
