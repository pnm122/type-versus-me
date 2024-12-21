import { User } from "$shared/types/User";

export default function sortUsersByScore(users: User[]) {
  return users.sort((a, b) => {
    if(b.lastScore?.failed && !a.lastScore?.failed) return -1
    if(a.lastScore?.failed && !b.lastScore?.failed) return 1
    return (b.lastScore?.netWPM ?? 0) - (a.lastScore?.netWPM ?? 0)
  })
}