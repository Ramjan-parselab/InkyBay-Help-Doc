import Banner from "./banner"

export default function Notification() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">JewelsLab Notification Examples</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Simple Variant (with X button)</h2>
          <Banner variant="simple" />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Buttons Variant (with Dismiss and View Changes)</h2>
          <Banner variant="buttons" />
        </div>
      </div>
    </div>
  )
}
