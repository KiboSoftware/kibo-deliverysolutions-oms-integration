import { Order } from "@kibocommerce/rest-sdk/clients/Commerce";
import { TimeWindow } from "../types/deliverySolutions";

export interface TimeWindows {
  pickupTime?: TimeWindow;
  dropoffTime?: TimeWindow;
}

export function mapTimeWindows(
  kiboOrder: Order,
  setDefaultValues?: boolean
): TimeWindows {
  let timeWindows: TimeWindows = {};
  const now = new Date().getTime();

  kiboOrder.attributes?.forEach((attribute) => {
    if (attribute?.values && attribute.values[0]) {
      let time = Date.parse(attribute.values[0]?.toString().trim());
      if (!time) return;
      let code = attribute.fullyQualifiedName?.split("~")?.slice(-1)[0];
      switch (code?.toLowerCase()) {
        case "pickupTimeStart".toLowerCase():
          if (!timeWindows.pickupTime) timeWindows.pickupTime = {};
          timeWindows.pickupTime.startsAt = time;
          break;
        case "pickupTimeEnd".toLowerCase():
          if (!timeWindows.pickupTime) timeWindows.pickupTime = {};
          timeWindows.pickupTime.endsAt = time;
          break;
        case "dropoffTimeStart".toLowerCase():
          if (!timeWindows.dropoffTime) timeWindows.dropoffTime = {};
          timeWindows.dropoffTime.startsAt = time;
          break;
        case "dropoffTimeEnd".toLowerCase():
          if (!timeWindows.dropoffTime) timeWindows.dropoffTime = {};
          timeWindows.dropoffTime.endsAt = time;
          break;
      }
    }
  });

  if (setDefaultValues !== false) {
    if (timeWindows.pickupTime == null) {
      timeWindows.pickupTime = {
        startsAt: now,
      };
    }
    if (timeWindows.pickupTime.endsAt == null) {
      timeWindows.pickupTime.endsAt =
        timeWindows.pickupTime.startsAt + 1000 * 60 * 60 * 24;
    }
    if (timeWindows.dropoffTime == null) {
      timeWindows.dropoffTime = {
        startsAt: now,
      };
    }
    if (timeWindows.dropoffTime.endsAt == null) {
      timeWindows.dropoffTime.endsAt =
        timeWindows.dropoffTime.startsAt + 1000 * 60 * 60 * 24;
    }
  }

  return timeWindows;
}
