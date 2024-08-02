"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { RxGithubLogo } from "react-icons/rx"
import { SiAuth0 } from "react-icons/si"
import * as z from "zod"

import { Api } from "@/lib/api"
import { analytics } from "@/lib/segment"
import { getSupabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Logo from "@/components/logo"
import { useAsync } from "react-use"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
})

const supabase = getSupabase()

export default function IndexPage() {
  const router = useRouter()
  const { value: showSidebar } = useAsync(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return false
    }
    router.push("/workflows")
  })
  const currentPageUrl = useRef<boolean>() // Initialize useRef
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Please wait, you will be signed in automatically",
    "Setting up your experience...",
    "Almost there, hang tight!"
  ];


  async function onSubmit() {
    if (email) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      })

      if (error) {
        toast({
          description: `Ooops! ${error?.message}`,
        })
        return
      }

      toast({
        description: "🎉 Yay! Check @otp for sign in link.",
      })
    }
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [messages.length]);

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options : {
        "redirectTo" : "http://localhost:3000"
      }
    })

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
      })
      return
    }
  }

  useEffect(() => {
    if (window.location.href.includes("http://localhost")) {
      currentPageUrl.current = true 
    }
    onSubmit()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === "SIGNED_IN") {
          const fetchProfileAndIdentify = async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", _session?.user.id)
              .single()
            if (profile.api_key) {
              const api = new Api(profile.api_key)
              await api.indentifyUser({
                anonymousId: (await analytics.user()).anonymousId(),
                email: _session?.user.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
                company: profile.company,
              })
            }
          }
          fetchProfileAndIdentify()
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <section className="container flex h-screen max-w-md flex-col justify-center gap-10">
      <Logo width={50} height={50} />
      <div className="flex flex-col space-y-0">
      {messages.map((message, index) => (
          <p
            key={index}
            className={`absolute text-lg font-semibold transition-opacity duration-1000 ease-in-out ${messageIndex === index ? 'opacity-100' : 'opacity-0'}`}
          >
            {message}
          </p>
        ))}
    </div>
      <Spinner />
      <Separator />
      {currentPageUrl.current && (
        <div className="max-w-md flex-col justify-center">
        <Button
          variant="secondary"
          size="sm"
          className="space-x-4"
          onClick={handleGoogleLogin}
        >
          <SiAuth0 size={20} />
          <p>Sign in</p>
        </Button>
        </div>
      )}

      <Toaster />
    </section>
  )
}
