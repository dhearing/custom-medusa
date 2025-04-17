"use client"
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Fragment } from "react"
import { useContext } from "react"
import { HomepageContext } from "@lib/context/homepage-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = () => {
  const homepageData = useContext(HomepageContext)
  
  // Sort navbar items by placement and combine with static items
  const menuItems = [
    ...(homepageData?.navbar?.sort((a, b) => a.placement - b.placement) ?? [])
  ]

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <PopoverButton
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  Menu
                </PopoverButton>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-6 items-start justify-start">
                      {menuItems.length > 0 ? menuItems.map((item) => {
                        return (
                          <li key={item.title}>
                            <LocalizedClientLink
                              href={item.link}
                              className="text-3xl leading-10 hover:text-ui-fg-disabled"
                              onClick={close}
                              data-testid={`${item.title.toLowerCase()}-link`}
                            >
                              {item.title}
                            </LocalizedClientLink>
                          </li>
                        )
                      }) : (
                        <p>Please insert menu items in the navigation menu editor section of the Backend</p>
                      )}
                    </ul>
                    <div className="flex justify-center">
                      © {new Date().getFullYear()} Store Name. All rights reserved.
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
