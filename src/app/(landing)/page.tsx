import { Check, NetworkIcon, StarIcon, Wallet } from "lucide-react"
import Heading from "@/components/Heading"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import ShinyButton from "@/components/ShinyButton"
import Image from "next/image"
import { Icons } from "@/components/icons"

const Page = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-brand-25">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <div>
              <Heading className="font-medium">
                <span>Reimagine Secret Santa,</span>
                <br />
                <span className="relative bg-linear-to-r from-brand-500 to-brand-800 text-transparent bg-clip-text">
                  with personality-driven gift-giving
                </span>
              </Heading>
            </div>

            <p className="text-base/7 text-gray-600 max-w-prose text-center text-pretty">
              Answer quirky questions and{" "}
              <span className="font-semibold text-gray-700">
                fill in the blanks and let your true self guide the perfect
                present
              </span>{" "}
              with the help of{" "}
              <span className="font-semibold">
                Gift<span className="text-brand-700">Match</span>
              </span>
            </p>

            <ul className="space-y-2 text-base/7 text-gray-600 text-left flex flex-col items-start">
              {[
                "Create or join a group with friends",
                "Personalized gift matching through unique personality questions",
                "Transform Secret Santa into a fun, connection-building experience",
              ].map((item, index) => (
                <li key={index} className="flex gap-1.5 items-center text-left">
                  <Check className="size-5 shrink-0 text-brand-700" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="w-full max-w-80">
              <ShinyButton
                href="/dashboard"
                className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                Create Your Group
              </ShinyButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Steps */}
      <section className="relative bg-brand-50 py-24 sm:py-32 h-full">
        <div className="inset-x-0 bottom-24 top-24">
          <div className="relative mx-auto">
            <MaxWidthWrapper className="relative">
              <div className="flex justify-between gap-4 md:gap-16 mx-auto">
                <div className="size-80 relative hidden sm:block">
                  <Image
                    src="/present.svg"
                    alt="present"
                    fill
                    className="object-contain object-center"
                  />
                </div>

                <div className="w-full sm:w-[50%] flex flex-col gap-y-4 items-center sm:items-start">
                  <h2 className="text-center text-base/7 font-semibold text-brand-600 uppercase">
                    Steps
                  </h2>
                  <Heading>
                    Easy to{" "}
                    <span className="font-medium text-brand-700">
                      Get Started
                    </span>
                  </Heading>

                  <div className="flex flex-col gap-y-6">
                    <div className="flex mt-2">
                      <span className="text-brand-800/80 text-3xl sm:text-5xl font-semibold tracking-wide">
                        01
                      </span>
                      <div className="flex flex-col ml-4 w-full gap-y-2">
                        <h2 className="text-gray-800 text-xl font-medium">
                          Create a Group
                        </h2>
                        <p className="text-md text-gray-500">
                          Invite friends, family, or coworkers via email to
                          join.
                        </p>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <span className="text-brand-800/80 text-3xl sm:text-5xl font-semibold tracking-wide">
                        02
                      </span>
                      <div className="flex flex-col ml-4 w-full gap-y-2">
                        <h2 className="text-gray-800 text-xl font-medium">
                          Answer Questions
                        </h2>
                        <p className="text-md text-gray-500">
                          Answer random questions that best describes yourself.
                        </p>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <span className="text-brand-800/80 text-3xl sm:text-5xl font-semibold tracking-wide">
                        03
                      </span>
                      <div className="flex flex-col ml-4 w-full gap-y-2">
                        <h2 className="text-gray-800 text-xl font-medium">
                          Draw
                        </h2>
                        <p className="text-md text-gray-500">
                          We will assign a random group member where you{" "}
                          <span className="text-brand-700 font-medium">
                            ONLY
                          </span>{" "}
                          know the questions and answers of that specific
                          person.
                        </p>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <span className="text-brand-800/80 text-3xl sm:text-5xl font-semibold tracking-wide">
                        04
                      </span>
                      <div className="flex flex-col ml-4 w-full gap-y-2">
                        <h2 className="text-gray-800 text-xl font-medium">
                          Guess and Gift
                        </h2>
                        <p className="text-md text-gray-500">
                          It is your job to try and figure out who you are
                          gifting, make sure you don&apos;t mess up!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MaxWidthWrapper>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="relative py-24 sm:py-32 bg-brand-25">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600 uppercase">
              Features
            </h2>
            <Heading>
              Stay ahead of your{" "}
              <span className="font-medium text-brand-700">Gifting fun</span>
            </Heading>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {/* first bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Personalized Wishlist
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Get gifts you really, really want for your special occasion.
                  </p>
                </div>

                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                    {/* TODO: put wishlist example image here */}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-[2rem]" />
            </div>

            {/* Second bento grid element */}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Secret Gifting Matchmaking
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Create custom gift exchange rules, prevent couples from
                    matching, set relationship-based pairing constraints, and
                    ensure fair, fun group dynamics.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  {/* TODO: grid image */}
                  <NetworkIcon className="max-lg:max-w-xs size-16" />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-t-[2rem]" />
            </div>

            {/* Third bento grid element */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Budget-Friendly Gifting
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Set group gift price limits, track spending, and ensure
                    everyone gives and receives gifts within a comfortable
                    budget range.
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  {/* TODO: grid image */}
                  <Wallet className="size-16 max-lg:max-w-xs" />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5" />
            </div>

            {/* fourth bento grid element */}
            {/* TODO: maybe replace this with something else */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                    Connect With Friends
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Follow your friends&apos; wishlists to make sure you get
                    something they actually want.
                  </p>
                </div>

                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Customer Reviews */}
      <section className="relative py-24 sm:py-32 bg-white">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600 uppercase">
              Application lovers
            </h2>
            <Heading className="text-center">
              What our users are{" "}
              <span className="text-brand-700 font-medium">saying</span>
            </Heading>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* First customer review */}
            <div className="flex flex-auto flex-col gap-4 bg-brand-25 p-6 sm:p-8 lg:p-16 rounded-t-[2rem] lg:rounded-tr-none lg:rounded-l-[2rem]">
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty">
                GiftMatch has been such an enjoyable application and has such a
                unique twist to secret santa that has made it fun with me and my
                friends.
              </p>

              <div className="flex flex-col justify-center lg:justify-start lg:flex-row items-center lg:items-start gap-4 mt-2">
                {/* image */}
                <Image
                  src="/user-2.png"
                  className="rounded-full object-cover"
                  alt="user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center lg:items-start">
                  <p className="font-semibold flex items-center">
                    Some name
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                </div>
              </div>
            </div>

            {/* Second customer review */}
            <div className="flex flex-auto flex-col gap-4 bg-brand-25 p-6 sm:p-8 lg:p-16 rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]">
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
                <StarIcon className="size-5 text-brand-600 fill-brand-600" />
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty">
                GiftMatch has been such an enjoyable application and has such a
                unique twist to secret santa that has made it fun with me and my
                friends.
              </p>

              <div className="flex flex-col justify-center lg:justify-start lg:flex-row items-center lg:items-start gap-4 mt-2">
                {/* image */}
                <Image
                  src="/user-1.png"
                  className="rounded-full object-cover"
                  alt="user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center lg:items-start">
                  <p className="font-semibold flex items-center">
                    Some name
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ShinyButton
            href="/sign-up"
            className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Try GiftMatch Now
          </ShinyButton>
        </MaxWidthWrapper>
      </section>
    </>
  )
}

export default Page
