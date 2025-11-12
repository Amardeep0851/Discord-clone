"use client"
import { ClerkLoaded, SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignUp fallbackRedirectUrl={"/"} />

  )

}