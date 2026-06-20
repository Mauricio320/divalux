export type ActionResult<T> = { success: true; data: T } | { success: false; error: string }
export type VoidResult = { success: true } | { success: false; error: string }

export async function unwrap<T>(p: Promise<ActionResult<T>>): Promise<T> {
  const r = await p
  if (!r.success) throw new Error(r.error)
  return r.data
}

export async function unwrapVoid(p: Promise<VoidResult>): Promise<void> {
  const r = await p
  if (!r.success) throw new Error(r.error)
}
