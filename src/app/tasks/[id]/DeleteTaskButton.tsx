"use client"

type DeleteTaskButtonProps = {
  action: () => Promise<void>
}

export default function DeleteTaskButton({ action }: DeleteTaskButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if(!window.confirm("削除してよろしいですか？")) {
          event.preventDefault()
        }
      }}
    >
      <button className="text-sm font-semibold text-red-600 hover:text-red-700" type="submit">
        削除
      </button>
    </form>
  )
}
