import * as Dialog from '@radix-ui/react-dialog'
import { ChangeEvent, useEffect, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { api } from '../../lib/requestHandler';

type User = {
    id: string,
    email: string,
    name: string,
    avatar: string
}

const token = localStorage.getItem('token')

export default function AddGroupPopup() {
    const [groupData, setGroupData] = useState<{name: string, members: string[]}>({
        name: "",
        members: []
    })
    const[users, setUsers] = useState<User[]>([])

    useEffect(() => {
        api.get("users/all", {
            headers:{
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            setUsers(response.data.users)
        }).catch(() => {
            alert("An error occurred while fetching users")
        })
    }, [])

    const addMember = (memberId: string) => {
        setGroupData((prevGroupData) => {
          // Check if the member already exists
          if (!prevGroupData.members.includes(memberId)) {
            return {
              ...prevGroupData,
              members: [...prevGroupData.members, memberId],
            };
          }
          return prevGroupData;
        });
      };

      const removeMember = (memberId: string) => {
        setGroupData((prevGroupData) => {
          // Check if the member exists
          if (prevGroupData.members.includes(memberId)) {
            return {
              ...prevGroupData,
              members: prevGroupData.members.filter((id) => id !== memberId),
            };
          }
          return prevGroupData;
        });
      };

    const handleGroupCreate = () => {
        api.post('groups', groupData, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            if (response.status === 200) {
                alert("Group created successfully")
                return
            }
        }).catch(() => {
            alert("An error occurred please try again later")
        })
    }
    return(
        <Dialog.Root>
            <Dialog.Trigger>
                <p className="text-blue-500 cursor-pointer mt-4">Add a new group</p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-50"/>
                <Dialog.Content className="w-11/12 max-w-[800px] max-h-[90svh] fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-4 overflow-y-scroll no-scrollbar">
                    <Dialog.Title className="font-bold text-xl">Create a new group</Dialog.Title>
                    <Dialog.Description></Dialog.Description>
                    <Dialog.Close>
                        <IoCloseOutline className=" text-3xl absolute top-4 right-4 cursor-pointer"/>
                    </Dialog.Close>
                    <fieldset className='flex flex-col gap-2'>
                        <label>Group name</label>
                        <input onChange={(event) => setGroupData({...groupData, name: event?.target.value})} className='border  focus:outline-green-400 focus:outline-none rounded-md px-1 py-2'></input>
                    </fieldset>
                    <p>Select members</p>
                    <div className='border-2 h-[250px] overflow-y-scroll'>
                        {
                            users.map((user) => (
                                <div key={user.id} className='flex gap-2'>
                                    <p>{user.name}</p>
                                    <input
                                        type='checkbox'
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                if (event.target.checked) {
                                                    addMember(user.id)
                                                } else {
                                                    removeMember(user.id)
                                                }
                                        }}></input>
                                </div>
                            ))
                        }
                    </div>
                    <Dialog.Close onClick={handleGroupCreate} className="w-full flex items-center justify-center mt-8">
                        <p className="bg-green-500 rounded-md text-white py-2 px-4">Create group</p>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}