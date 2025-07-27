"use client";
import React from "react";

export interface User {
  userID: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  planID: number;
  friends: number[];
  friendRequests: number[];
}

export default function UsersTable(props: { users: User[] }) {
  
  const headers = ["Username", "Email", "Plan"];
  return (
    <table className="table-auto overflow-auto border-separate border-spacing-y-8">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.users.map((user) => (
          <tr key={user.userID}>
            <td>{user.username}</td>
            <td>{user.firstName}</td>
            <td>{user.email}</td>
            <td>{user.planID}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
