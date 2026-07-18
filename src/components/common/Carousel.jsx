import { CalendarDays, ImageOff, MapPin } from "lucide-react";
import { Carousel as AntCarousel } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getLoginCarouselEvents } from "../../services/eventService";
import { getNoticeText } from "../../pages/admin/notices/noticeContentUtils";

const getList = (response) => response?.data?.data || response?.data?.events || [];

const pickPoster = (event) =>
  event?.poster ||
  event?.posterUrl ||
  event?.banner ||
  event?.bannerUrl ||
  event?.image ||
  event?.imageUrl ||
  event?.attachment?.url ||
  "";

const formatEventDate = (value) => {
  if (!value) return "Event date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Event date";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sortLatestUpdated = (events = []) =>
  [...events].sort((first, second) => {
    const firstDate = new Date(first.updatedAt || first.startDate || first.createdAt);
    const secondDate = new Date(second.updatedAt || second.startDate || second.createdAt);
    return secondDate - firstDate;
  });

const EmptyCarouselState = () => (
  <div className="flex h-full items-center justify-center bg-[var(--university-ink)] px-8 text-center text-white">
    <div className="max-w-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
        <ImageOff size={24} />
      </span>
      <h2 className="mt-5 text-2xl font-black">No Event Posters</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/72">
        Recent and upcoming event posters will appear here once published.
      </p>
    </div>
  </div>
);

const EventPosterSlide = ({ event }) => {
  const poster = pickPoster(event);
  const description = getNoticeText(event.description || event.content || "");

  return (
    <article className="relative h-full min-h-0 overflow-hidden bg-[var(--university-ink)]">
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-xl"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/20 to-slate-950/75" />
      <div className="relative flex h-full min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6 xl:p-8">
          <img
            src={poster}
            alt={event.title || "Event poster"}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/15"
          />
        </div>
        <div className="shrink-0 px-5 pb-12 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white ring-1 ring-white/20">
              Latest Event
            </span>
            <h2 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-white xl:text-4xl">
              {event.title || "University Event"}
            </h2>
            {description ? (
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white/82">{description}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {formatEventDate(event.startDate || event.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {event.location || "K.R. Mangalam University"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Carousel = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let ignore = false;

    const loadEvents = async () => {
      try {
        const response = await getLoginCarouselEvents();
        const posters = sortLatestUpdated(getList(response))
          .filter((event) => pickPoster(event))
          .slice(0, 4);

        if (!ignore) {
          setEvents(posters);
        }
      } catch {
        if (!ignore) {
          setEvents([]);
        }
      }
    };

    loadEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const slides = useMemo(() => sortLatestUpdated(events).slice(0, 4), [events]);

  if (!slides.length) {
    return (
      <div className="login-carousel h-full bg-[var(--university-ink)]">
        <EmptyCarouselState />
      </div>
    );
  }

  if (slides.length === 1) {
    return (
      <div className="login-carousel h-full bg-[var(--university-ink)]">
        <EventPosterSlide event={slides[0]} />
      </div>
    );
  }

  return (
    <div className="login-carousel h-full bg-[var(--university-ink)]">
      <AntCarousel autoplay autoplaySpeed={4500} className="h-full" dots>
        {slides.map((event, index) => (
          <EventPosterSlide key={event._id || `${event.title}-${index}`} event={event} />
        ))}
      </AntCarousel>
    </div>
  );
};

export default Carousel;
