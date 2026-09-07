import { PoolSurface } from "@/components/water/PoolSurface";
import { RainDance } from "@/components/water/RainDance";
import { PhotoWindow } from "@/components/PhotoWindow";

/**
 * The two standout draws, and the only two interactive set-pieces on the
 * page. Neither has fixed hours — guests use them whenever they like — so
 * this segment sits between lunch and snacks on the rail without claiming a
 * window it doesn't have.
 */
export function Afternoon() {
  return (
    <div>
      <p className="max-w-prose text-[1.15rem] leading-relaxed">
        Neither of these runs to a timetable. The pool and the sprinklers are
        yours for as long as you&rsquo;re here — before lunch, after lunch, at
        six in the evening because someone finally worked up the nerve.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
        <div>
          <h3 className="font-display text-[1.9rem] leading-tight">The pool</h3>
          <p className="mt-3 max-w-prose text-[1.02rem] leading-relaxed">
            Filled from our own tubewell, then properly chlorinated and looked
            after between stays — which is the part that actually matters. It
            is yours alone while you&rsquo;re here: no sharing it with another
            booking, no queueing for the shallow end.
          </p>
          <div className="mt-6">
            <PoolSurface />
          </div>
        </div>

        <div>
          <h3 className="font-display text-[1.9rem] leading-tight">
            The rain dance
          </h3>
          <p className="mt-3 max-w-prose text-[1.02rem] leading-relaxed">
            Sprinklers overhead, everybody underneath, somebody&rsquo;s phone
            being rescued at the last second. It goes on when you want it on.
          </p>
          <div className="mt-6">
            <RainDance />
          </div>
          <p className="mt-3 text-[13px] opacity-60">
            Try the switch — that&rsquo;s roughly the effect, minus the
            shrieking.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <PhotoWindow
          src="/photos/pool-02.jpg"
          ratio="3:2"
          label="The pool at Sweet Orchard Farm"
        />
        <PhotoWindow
          src="/photos/rain-dance-02.jpg"
          ratio="3:2"
          label="The rain dance at Sweet Orchard Farm"
        />
      </div>
    </div>
  );
}
