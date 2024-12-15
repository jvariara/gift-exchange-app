"use client"
import { client } from "@/lib/client"
import { GROUP_VALIDATOR, GroupForm } from "@/lib/validators/group-validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PropsWithChildren, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Modal } from "../ui/modal"
import { Switch } from "../ui/switch"
import { Clipboard } from "lucide-react"
import InviteLinkModal from "./InviteLinkModal"

interface CreateGroupModalProps extends PropsWithChildren {
  containerClassName?: string
}

const CreateGroupModal = ({
  children,
  containerClassName,
}: CreateGroupModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)
  const [invitationLink, setInvitationLink] = useState("")
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: GroupForm) => {
      const submitData: GroupForm = {
        name: data.name,
        questionMethod: data.questionMethod,
        customQuestions:
          data.questionMethod === "custom"
            ? data.customQuestions?.filter((q) => q.question.trim() !== "")
            : [],
      }
      const response = await client.group.createGroup.$post(submitData)
      const result = response.json()
      return result
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] })
      setIsOpen(false)
      reset({
        name: "",
        questionMethod: "random",
        customQuestions: [{ question: "" }, { question: "" }, { question: "" }],
      })
      setInvitationLink(data.invitationLink.token)
      setTimeout(() => {
        setIsInvitationModalOpen(true)
      }, 100)
    },
    onError: (error) => {
      console.log("Group creation error: ", error)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<GroupForm>({
    resolver: zodResolver(GROUP_VALIDATOR),
    defaultValues: {
      name: "",
      questionMethod: "random",
      customQuestions: [{ question: "" }, { question: "" }, { question: "" }],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: "customQuestions",
  })

  const questionMethod = watch("questionMethod")

  const onSubmit = (data: GroupForm) => {
    mutate(data)
  }

  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              New Group
            </h2>
            <p className="text-sm/6 text-gray-600">
              Create a new group with your friends!
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                autoFocus
                id="name"
                {...register("name")}
                placeholder="Secret Santa"
                className="w-full"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Switch
                id="questionMethod"
                checked={questionMethod === "custom"}
                onCheckedChange={(checked) =>
                  setValue("questionMethod", checked ? "custom" : "random")
                }
              />
              <Label htmlFor="questionMethod">Custom Questions</Label>
            </div>

            {questionMethod === "custom" && (
              <div>
                <Label htmlFor="customQuestions">Custom Questions</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-2">
                    <Label htmlFor={`customQuestions.${index}.question`}>
                      Question {index + 1}
                    </Label>
                    <Input
                      id={`customQuestions.${index}.question`} // Unique ID for each input
                      {...register(`customQuestions.${index}.question`)}
                      className="w-full border rounded p-2"
                      placeholder={`Question ${index + 1}`}
                    />
                    {errors.customQuestions?.[index]?.question && (
                      <p className="text-red-500">
                        {errors.customQuestions[index]?.question?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invitation Modal */}
      <InviteLinkModal token={invitationLink} />
    </>
  )
}

export default CreateGroupModal
