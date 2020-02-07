import {
  updateHiddenProperty,
  resetTitleCount
} from "client-app/lib/utilities";
import Evented from "@ember/object/evented";
import EmberObject from "@ember/object";

const TARGETS = ["component", "route"];

export function initialize(app) {
  // config for moment.js
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "secs",
      m: "a min",
      mm: "%d mins",
      h: "an hr",
      hh: "%d hrs",
      d: "a day",
      dd: "%d days",
      M: "a mth",
      MM: "%d mths",
      y: "a yr",
      yy: "%d yrs"
    }
  });

  // setup event for updating document title and title count
  let hiddenProperty;
  let visibilitychange;

  ["", "webkit", "ms", "moz", "ms"].forEach(prefix => {
    const check = prefix + (prefix === "" ? "hidden" : "Hidden");
    if (document[check] !== undefined && !hiddenProperty) {
      hiddenProperty = check;
      visibilitychange = prefix + "visibilitychange";
    }
  });

  updateHiddenProperty(hiddenProperty);
  document.addEventListener(
    visibilitychange,
    () => {
      resetTitleCount();
    },
    false
  );

  app.register("events:main", EmberObject.extend(Evented).create(), {
    instantiate: false
  });
  TARGETS.forEach(t => app.inject(t, "events", "events:main"));

  const isMobile =
    /mobile/i.test(navigator.userAgent) && !/iPad/.test(navigator.userAgent);
  if (isMobile) {
    document.body.classList.add("mobile");
  }
  app.register("site:main", { isMobile }, { instantiate: false });
  app.inject("controller", "site", "site:main");
}

export default {
  initialize
};
