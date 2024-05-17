"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Agent } from "@/models/models"
import { TbTrash } from "react-icons/tb"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useEditableField } from "@/components/hooks"
import Avatar from "./avatar"

type Mode = "view" | "edit"

export default function Header({
  agent,
  profile,
  email,
}: {
  agent: Agent
  profile: Profile
  email: String | undefined
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()

  const { toast } = useToast()

  const [avatar, setAvatar] = React.useState(agent.avatar || "/logo.png")
  const [selectedCategory, setCategory] = React.useState<string | null>(null)
  const [tags, setTags] = React.useState("")

  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false)
  const [preferredBotName, setPreferredBotName] = React.useState("")
  const [isUsernameAvailable, setUsernameAvailable] = React.useState<
    boolean | null
  >(null)
  const [isCheckingAvailability, setIsCheckingAvailability] =
    React.useState(false)
  const [availabilityCheckDone, setAvailabilityCheckDone] =
    React.useState(false)
  const [publishToMarketplace, setPublishToMarketplace] = React.useState(false)

  const handleCheckUsernameAvailability = async () => {
    setIsCheckingAvailability(true)
    setAvailabilityCheckDone(false)
    setUsernameAvailable(null) // Reset availability status

    try {
      const response = await fetch(
        `https://matrix.pixx.co/_matrix/client/v3/register/available?username=${preferredBotName}`
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

    const deployUrl = `https://bots.pixx.co/add`
    const response = await fetch(deployUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: email,
        bot_username: preferredBotName,
        api_key: profile.api_key,
        name: agent.name,
        description: agent.description,
        profile: avatar,
        tags: tags,
        category: selectedCategory,
        id: agent.id,
        type: "AGENT",
        publish: publishToMarketplace,
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

  const onAgentDelete = async () => {
    await api.deleteAgentById(agent.id)
    toast({
      description: `Agent with ID: ${agent.id} deleted!`,
    })
    router.refresh()
    router.push("/agents")
  }

  const onUpdateAgentName = async (name: string) => {
    await api.patchAgent(agent.id, { name })
    router.refresh()
  }

  const handleUpload = React.useCallback(
    async (url: any) => {
      setAvatar(url)
    }, []
  )

  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex flex-col">
        <div className="flex space-x-2 py-2 text-sm text-muted-foreground">
          <Link passHref href="/agents">
            <span>Agents</span>
          </Link>
          <span>/</span>
          <Badge variant="secondary">
            <div className="flex items-center space-x-1">
              <span className="font-mono font-normal text-muted-foreground">
                {agent?.id}
              </span>
            </div>
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            {useEditableField(agent.name, onUpdateAgentName)}

            <span className="font-mono text-xs font-normal text-muted-foreground">
              <span>
                CREATED AT:{" "}
                <span className="text-foreground">
                  {agent.createdAt.toString()}
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Button
          className="space-x-2"
          size="sm"
          variant="outline"
          onClick={() => setDeleteModalOpen(true)}
        >
          <TbTrash size={20} />
          <span>Delete</span>
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAgentDelete}>
              Yes, delete!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
          <center><Avatar
            accept=".jpg, .jpeg, .png, .gif"
            onSelect={handleUpload}
            imageUrl={avatar}
          /></center>
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
            disabled={isCheckingAvailability || preferredBotName.trim() === ""}
          >
            Check Availability
          </Button>

          <DialogHeader>
            <DialogTitle>Category</DialogTitle>
            <DialogDescription>
              Enter the category that will be associated with your bot.
            </DialogDescription>
          </DialogHeader>

          <select value={selectedCategory || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50" onChange={(event) => {
            const value = typeof event.target.value === 'string' && event.target.value !== 'null' ? event.target.value : null;
            setCategory(value);
          }}>
            <option value={'null'}>Select category...</option>
            {[
                {
                  value: 'fun',
                  label: 'Fun',
                }, {
                  value: 'agi',
                  label: 'AGI',
                }, {
                  value: 'work',
                  label: 'Work',
                }
                ].map((tag) => (
                  <option className="" value={tag.value}>
                    {tag.label}
                  </option>
            ))}
          </select>

          <DialogHeader>
            <DialogTitle>Tags</DialogTitle>
            <DialogDescription>
              Enter the tags that will be associated with your bot.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags"
          />
          <DialogHeader>
            <DialogTitle>Publish to Marketplace</DialogTitle>
          </DialogHeader>
          <Input
            type="checkbox"
            defaultChecked={publishToMarketplace}
            onChange={() => setPublishToMarketplace(!publishToMarketplace)}
          />
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
  )
}
