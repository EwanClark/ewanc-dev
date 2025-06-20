import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaRegCheckCircle } from "react-icons/fa"

export default function SignupSuccessPage() {
  return (
    <>
      <Navbar />
      <div className="container py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <FaRegCheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">Account Created</CardTitle>
            <CardDescription className="text-center">
              Your account has been successfully created. Please check your email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>
              We&apos;ve sent a verification link to your email address. Please click on the link to verify your account and
              complete the registration process.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
