import { NavLink } from "@/components/ui/nav-link"

const navItems = ["Dashboard", "Budget", "Expenses", "Quizzes", "Achievements"]

interface NavItemsProps {
  mobile?: boolean
  onItemClick?: () => void
}

export function NavItems({ mobile = false, onItemClick }: NavItemsProps) {
  return navItems.map((item) => (
    <NavLink
      key={item}
      href={`/${item.toLowerCase()}`}
      className={mobile ? "flex items-center" : ""}
      onClick={onItemClick}
    >
      {item}
    </NavLink>
  ))
}

