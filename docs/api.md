# TaskMaster API Notes

## Base URL

`/api/v1`

## Authentication

Use `Authorization: Bearer <token>` for protected endpoints.

## Main Resources

- Auth: register, login, logout
- Users: get/update/delete current user
- Tasks: CRUD, status updates, assignments, filters
- Teams: CRUD, invite and remove members
- Comments: list/add/delete per task
- Attachments: upload/delete per task

## Data Model Summary

- User has many created and assigned tasks
- Team has many users through TeamMember
- Task belongs to creator, assignee, team
- Task has many comments and attachments
