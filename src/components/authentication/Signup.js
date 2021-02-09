import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContexts";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordConfirmationRef.current.value !== passwordRef.current.value) {
      return setError("Passwords didnot match");
    }
    try {
      setError("");
      await signUp(emailRef.current.value, passwordRef.current.value);
      setIsLoading(true);
    } catch {
      setError("Failed to Create an Account");
    }
    setIsLoading(false);
    history.push("/user");
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
              <Form.Control type='email' required ref={emailRef} />
            </Form.Group>

            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' required ref={passwordRef} />
            </Form.Group>

            <Form.Group id='password-confirmation'>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type='password'
                required
                ref={passwordConfirmationRef}
              />
            </Form.Group>

            <Button type='submit' disabled={isLoading} className='w-100'>
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        Already have an account? <Link to='/login'>Log In</Link>
      </div>
    </CenteredContainer>
  );
}
