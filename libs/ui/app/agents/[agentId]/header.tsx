"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"
import { CodeBlock, dracula } from "react-code-blocks"
import { RxCopy } from "react-icons/rx"
import { TbLink, TbTrashX } from "react-icons/tb"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { cn, encodeToIdentifier } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://super.multi.so"
    : "http://localhost:3000"

export default function Header({
  agent,
  profile,
  email
}: {
  agent: Agent
  profile: Profile
  email: String | undefined
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()
  const [preferredBotName, setPreferredBotName] = useState("")
  const [isUsernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityCheckDone, setAvailabilityCheckDone] = useState(false)

  const handleCheckUsernameAvailability = async () => {
    setIsCheckingAvailability(true)
    setAvailabilityCheckDone(false)
    setUsernameAvailable(null) // Reset availability status

    try {
      const response = await fetch(
        `https://matrix.multi.so/_matrix/client/v3/register/available?username=${preferredBotName}`
      )

      // Set availability based on response status
      if (response.status === 200) {
        setUsernameAvailable(true)
      } else if (response.status === 400) {
        setUsernameAvailable(false)
      }
    } catch (error) {
      toast({
        description: "An error occurred while checking username availability.",
      })
    } finally {
      setIsCheckingAvailability(false)
      setAvailabilityCheckDone(true)
    }
  }

  const handleDeploySubmit = async () => {
    const deployUrl = `https://bots.multi.so/add`
    const profilePhoto = agent.avatar === null ? "" : agent.avatar;
    const response = await fetch(deployUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        bot_username: preferredBotName,
        api_key: profile.api_key,
        agent_name: agent.name,
        agent_desc: agent.description,
        profile: profilePhoto,
        agent_id: agent.id
      }),
    })

    // Check response and show toast notification accordingly
    if (response.ok) {
      toast({
        description: "Bot deployed successfully!",
      })
    } else {
      toast({
        description: "Failed to deploy bot. Please try again.",
      })
    }
  }

  const handleDelete = async () => {
    await api.deleteAgentById(agent.id)
    toast({
      description: `Agent with ID: ${agent.id} deleted!`,
    })
    router.refresh()
    router.push("/agents")
  }

  const handleCopyIdToClipboard = () => {
    navigator.clipboard.writeText(agent.id)
    toast({
      description: "Copied ID to clipboard",
    })
  }

  const embedCode = `<!-- This can be placed anywhere -->
<div id="superagent-chat"></div>

<!-- This should be placed before the
closing </body> tag -->
<script src="https://unpkg.com/superagent-chat-embed-v01/dist/web.js"></script>
<script>
Superagent({
  authorization: "${encodeToIdentifier(agent.id, profile.api_key)}",
  type: "inline"
});
</script>`

  return (
    <>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-lg">{agent.name}</p>
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleDelete()}>
            <TbTrashX size="18px" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleCopyIdToClipboard()}
          >
            <TbLink fontSize="18px" />
          </Button>
          <Dialog>
            <DialogTrigger
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Share
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share or embed your agent</DialogTitle>
                <DialogDescription>
                  Share this agent with anyone or embed it into your
                  application.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-2">
                <p className="font-bold">Share</p>
                <div className="flex justify-between space-x-2">
                  <Input
                    value={`${baseUrl}/share/${encodeToIdentifier(
                      agent.id,
                      profile.api_key
                    )}`}
                  />
                  <Button
                    variant="secondary"
                    className="flex space-x-2"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${baseUrl}/share/${encodeToIdentifier(
                          agent.id,
                          profile.api_key
                        )}`
                      )
                      toast({
                        description: "Link copied to clipboard!",
                      })
                    }}
                  >
                    <RxCopy />
                    <p>Copy</p>
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2">
                <p className="font-bold">Embed</p>
                <p className="text-muted-foreground text-sm">
                  Copy the following code and place it before the closing body
                  tag. You can choose between inline or popup as options.
                </p>
                <div className="relative max-w-full font-mono text-sm">
                  <CodeBlock
                    text={embedCode}
                    language="html"
                    showLineNumbers
                    theme={dracula}
                    codeContainerStyle={{ width: "450px", overflow: "scroll" }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary">
                Deploy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy your bot</DialogTitle>
                <DialogDescription>
                  Enter your preferred bot name and deploy it.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={preferredBotName}
                onChange={(e) => setPreferredBotName(e.target.value)}
                placeholder="Preferred bot name"
                disabled={isCheckingAvailability}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCheckUsernameAvailability}
                disabled={
                  isCheckingAvailability || preferredBotName.trim() === ""
                }
              >
                Check Availability
              </Button>
              {availabilityCheckDone &&
                (isUsernameAvailable ? (
                  <p>Username is available!</p>
                ) : (
                  <p>Username is not available. Try another one.</p>
                ))}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDeploySubmit}
                disabled={!isUsernameAvailable}
              >
                Deploy
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Toaster />
    </>
  )
}
