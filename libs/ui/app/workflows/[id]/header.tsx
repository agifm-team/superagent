import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workflow } from "@/models/models";
import { TbCode, TbTrash } from "react-icons/tb";

import { Profile } from "@/types/profile";
import { Api } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEditableField } from "@/components/hooks/";
import Avatar from "@/app/agents/[agentId]/avatar";

interface HeaderProps {
  profile: Profile;
  workflow: Workflow;
  email: string;
}

const Header = ({ profile, workflow, email }: HeaderProps) => {
  const router = useRouter();
  const api = new Api(profile.api_key);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [avatar, setAvatar] = useState("");
  const [selectedCategory, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [preferredBotName, setPreferredBotName] = useState("");
  const [isUsernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityCheckDone, setAvailabilityCheckDone] = useState(false);
  const [publishToMarketplace, setPublishToMarketplace] = useState(false);
  const [agentType, setAgentType] = useState("single-agent");
  const [publishSubAgents, setPublishSubAgents] = useState(false);

  const handleCheckUsernameAvailability = async () => {
    if (!preferredBotName.trim()) return;

    setIsCheckingAvailability(true);
    setAvailabilityCheckDone(false);
    setUsernameAvailable(null);

    try {
      const response = await fetch(
        `https://matrix.spaceship.im/_matrix/client/v3/register/available?username=${preferredBotName}`
      );
      setUsernameAvailable(response.status === 200);
    } catch (error) {
      toast({
        description: "An error occurred while checking username availability.",
      });
    } finally {
      setIsCheckingAvailability(false);
      setAvailabilityCheckDone(true);
    }
  };

  const handleDeploySubmit = async () => {
    const deployUrl = `https://bots.spaceship.im/add`;
    try {
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
          tags,
          category: selectedCategory,
          type: "WORKFLOW",
          publish: publishToMarketplace,
          profile: avatar,
          streaming: agentType === "single-agent",
          publish_all: publishSubAgents,
        }),
      });

      if (response.ok) {
        toast({ description: "Bot deployed successfully!" });
      } else {
        throw new Error("Failed to deploy bot");
      }
    } catch (error) {
      toast({ description: "Failed to deploy bot. Please try again." });
    }
  };

  const updateName = async (name: string) => {
    await api.patchWorkflow(workflow.id, { ...workflow, name });
    router.refresh();
  };

  const handleUpload = useCallback(async (url: string) => {
    setAvatar(url);
    // If there's any asynchronous operation needed after setting the avatar, add it here
    // For example: await someAsyncOperation();
  }, []);

  return (
    <>
      <div className="flex space-x-2 px-6 text-sm text-muted-foreground">
        <Link href="/workflows">Workflows</Link>
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
            CREATED AT:{" "}
            <span className="text-foreground">
              {workflow.createdAt.toString()}
            </span>
          </span>
        </div>
        <div className="flex space-x-2">
          <Link
            href="https://docs.superagent.sh/api-reference/api-reference/workflow/invoke"
            target="_blank"
            passHref
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
                    await api.deleteWorkflow(workflow.id);
                    router.push("/workflows");
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
            <DialogContent className="max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Deploy your bot</DialogTitle>
                <DialogDescription>
                  Enter your preferred bot name and deploy it.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Avatar
                    accept=".jpg, .jpeg, .png, .gif"
                    onSelect={handleUpload}
                    imageUrl={avatar}
                  />
                </div>
                <div>
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
                    disabled={isCheckingAvailability || !preferredBotName.trim()}
                    className="mt-2"
                  >
                    {isCheckingAvailability ? "Checking..." : "Check Availability"}
                  </Button>
                  {availabilityCheckDone && (
                    <p className={`mt-2 ${isUsernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {isUsernameAvailable
                        ? "Username is available!"
                        : "Username is not available. Try another one."}
                    </p>
                  )}
                </div>
                <div>
                  <DialogHeader>
                    <DialogTitle>Category</DialogTitle>
                    <DialogDescription>
                      Select the category that will be associated with your bot.
                    </DialogDescription>
                  </DialogHeader>
                  <select
                    value={selectedCategory || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setCategory(e.target.value !== "null" ? e.target.value : null)}
                  >
                    <option value="null">Select category...</option>
                    {[
                      { value: "fun", label: "Fun" },
                      { value: "agi", label: "AGI" },
                      { value: "work", label: "Work" },
                    ].map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <DialogHeader>
                    <DialogTitle>Tags</DialogTitle>
                    <DialogDescription>
                      Enter the tags that will be associated with your bot.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="publishToMarketplace"
                    checked={publishToMarketplace}
                    onChange={() => setPublishToMarketplace(!publishToMarketplace)}
                  />
                  <label htmlFor="publishToMarketplace">Publish to Marketplace</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="publishSubAgents"
                    checked={publishSubAgents}
                    onChange={() => setPublishSubAgents(!publishSubAgents)}
                  />
                  <label htmlFor="publishSubAgents">Publish Sub Agents</label>
                </div>
                <div>
                  <DialogHeader>
                    <DialogTitle>Deploy as Agent Type</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <Input
                        type="radio"
                        name="agentType"
                        value="single-agent"
                        checked={agentType === "single-agent"}
                        onChange={() => setAgentType("single-agent")}
                      />
                      <span>Single Agent - send all workflow responses as one agent</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Input
                        type="radio"
                        name="agentType"
                        value="multi-agent"
                        checked={agentType === "multi-agent"}
                        onChange={() => setAgentType("multi-agent")}
                      />
                      <span>Multi-Agent - send all workflow responses as separate agents</span>
                    </label>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDeploySubmit}
                  disabled={!isUsernameAvailable}
                >
                  Deploy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Header;
