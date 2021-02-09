import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContexts";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { logIn } = useAuth();
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await logIn(emailRef.current.value, passwordRef.current.value);
      setIsLoading(true);
      history.push("/");
    } catch {
      setError("Failed to Log In");
    }
    setIsLoading(false);
  }
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h1 className='text-center mb-4'>Log In</h1>
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

            <Button type='submit' disabled={isLoading} className='w-100'>
              Log In
            </Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/forgot-password'>Forgot Password?</Link>
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
