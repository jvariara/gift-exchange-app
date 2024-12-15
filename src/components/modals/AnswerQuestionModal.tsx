"use client"
import React, { PropsWithChildren, useEffect, useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import {
  QUESTION_ANSWER_VALIDATOR,
  QuestionAnswerForm,
} from "@/lib/validators/question-validator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Group } from "@prisma/client"
import LoadingSpinner from "../LoadingSpinner"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface AnswerQuestionModalProps extends PropsWithChildren {
  containerClassName?: string
  hasAnsweredQuestions: boolean
  group: Group
}

const AnswerQuestionModal = ({
  children,
  containerClassName,
  hasAnsweredQuestions,
  group,
}: AnswerQuestionModalProps) => {
  const [showQuestionModal, setShowQuestionModal] = useState(
    !hasAnsweredQuestions
  )

  const { data: groupQuestions, isPending: isGroupQuestionsLoading } = useQuery(
    {
      queryKey: ["group-questions"],
      queryFn: async () => {
        const res = await client.group.getGroupQuestions.$get({ id: group.id })
        const { questions } = await res.json()
        return questions
      },
    }
  )

  const { mutate: submitAnswers, isPending: isAnswersSubmitting } = useMutation(
    {
      mutationFn: async (data: QuestionAnswerForm) => {
        const response = await client.group.answerGroupQuestions.$post(data)
        const result = await response.json()

        return result
      },
      onSuccess: (data) => {
        // setHasAnswered(true)
        setShowQuestionModal(false)
      },
      onError: (error) => {
        console.log("Error while submitting answers: ", error)
      },
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<QuestionAnswerForm>({
    resolver: zodResolver(QUESTION_ANSWER_VALIDATOR),
  })

  useEffect(() => {
    if (groupQuestions) {
      groupQuestions.forEach((question, index) => {
        setValue(`answers.${index}.questionId`, question.id)
        setValue(`answers.${index}.answer`, "")
      })
    }
  }, [groupQuestions, setValue])

  if (!group || isGroupQuestionsLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    )
  }

  const onSubmit = (data: QuestionAnswerForm) => {
    submitAnswers(data)
  }

  return (
    <>
      <div
        className={containerClassName}
        onClick={() => setShowQuestionModal(true)}
      >
        {children}
      </div>

      <Modal
        className="max-w-xl p-8"
        showModal={showQuestionModal}
        setShowModal={setShowQuestionModal}
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Questions
            </h2>
            <p className="text-sm/6 text-gray-600">
              Answer these questions to help assist the person who draws you
            </p>
          </div>

          <div className="space-y-5">
            {groupQuestions &&
              groupQuestions.map((question, index) => (
                <div key={question.id} className="space-y-1">
                  <Label htmlFor={question.id}>Question {index + 1}</Label>
                  <p>{question.question.text}</p>
                  <Input
                    autoFocus={index === 0}
                    id={question.id}
                    {...register(`answers.${index}.answer`)}
                  />
                  {errors.answers?.[index]?.answer && (
                    <p className="text-sm/6 text-red-600">
                      {errors.answers?.[index]?.answer?.message}
                    </p>
                  )}
                </div>
              ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowQuestionModal(false)}
            >
              Cancel
            </Button>
            <Button disabled={isAnswersSubmitting} type="submit">
              {isAnswersSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AnswerQuestionModal
