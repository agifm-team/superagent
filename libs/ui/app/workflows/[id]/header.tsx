import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Workflow } from "@/models/models"
import { TbCode, TbTrash } from "react-icons/tb"

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
import { useEditableField } from "@/components/hooks/"
import Avatar from "@/app/agents/[agentId]/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HeaderProps {
  profile: Profile
  workflow: Workflow
  email: any
}

const Header = ({ profile, workflow, email }: HeaderProps) => {
  const router = useRouter()
  const api = new Api(profile.api_key)
  const [open, setOpen] = useState<boolean>(false)

  const { toast } = useToast()

  const [avatar, setAvatar] = React.useState("/logo.png")
  const [selectedCategory, setCategory] = React.useState(undefined)
  const [tags, setTags] = useState("")

  const [preferredBotName, setPreferredBotName] = useState("")
  const [isUsernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityCheckDone, setAvailabilityCheckDone] = useState(false)
  const [publishToMarketplace, setPublishToMarketplace] = useState(false)

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
        api_key: profile.api_key,
        email_id: email,
        bot_username: preferredBotName,
        name: workflow.name,
        description: workflow.description,
        id: workflow.id,
        tags: tags,
        // category: selectedCategory,
        type: "WORKFLOW",
        publish: publishToMarketplace,
        profile: avatar
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

  const updateName = async (name: string) => {
    await api.patchWorkflow(workflow.id, {
      ...workflow,
      name,
    })
    router.refresh()
  }

  const handleUpload = React.useCallback(
    async (url: any) => {
      setAvatar(url)
    },
  )

  /*
      DON'T USE THIS! THIS WILL CRASH YOUR COMPUTER!

        <DialogHeader>
            <DialogTitle>Category</DialogTitle>
            <DialogDescription>
              Enter the category that will be associated with your bot.
            </DialogDescription>
          </DialogHeader>
          <Select
            onValueChange={(cat) => setCategory(cat)}
            defaultValue={selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
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
                <SelectItem
                  key={tag.value}
                  value={tag.value}
                >
                  {tag.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  */

  return (
    <>
      <div className="flex space-x-2 px-6 text-sm text-muted-foreground">
        <Link passHref href="/workflows">
          <span>Workflows</span>
        </Link>
        <span>/</span>
        <Badge variant="secondary">
          <div className="flex items-center space-x-1">
            <span className="font-mono font-normal text-muted-foreground">
              {workflow?.id}
            </span>
          </div>
        </Badge>
      </div>
      <div className="flex items-center justify-between px-6">
        <div className="flex flex-col space-y-2">
          {useEditableField(workflow.name, updateName)}

          <span className="font-mono text-xs font-normal text-muted-foreground">
            <span>
              CREATED AT:{" "}
              <span className="text-foreground">
                {workflow.createdAt.toString()}
              </span>
            </span>
          </span>
        </div>
        <div className="flex space-x-2">
          <Link
            passHref
            target="_blank"
            href="https://docs.superagent.sh/api-reference/api-reference/workflow/invoke"
          >
            <Button className="space-x-2" size="sm" variant="outline">
              <TbCode size={20} />
              <span>API</span>
            </Button>
          </Link>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <Button
              className="space-x-2"
              size="sm"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <TbTrash size={20} />
              <span>Delete</span>
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await api.deleteWorkflow(workflow.id)
                    router.push("/workflows")
                  }}
                >
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
                disabled={
                  isCheckingAvailability || preferredBotName.trim() === ""
                }
              >
                Check Availability
              </Button>
              
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
      </div>
    </>
  )
}

export default Header
