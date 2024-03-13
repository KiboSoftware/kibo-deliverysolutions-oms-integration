import { mapTimeWindows } from "../../mappers/orderMappers";

describe("mapTimeWindows", () => {
  test("should map time windows correctly", () => {
    const kiboOrder = {
      attributes: [
        {
          fullyQualifiedName: "pickupTimeStart",
          values: ["2022-01-01T10:00:00Z"],
        },
        {
          fullyQualifiedName: "pickupTimeEnd",
          values: ["2022-01-01T12:00:00Z"],
        },
        {
          fullyQualifiedName: "dropoffTimeStart",
          values: ["2022-01-01T14:00:00Z"],
        },
        {
          fullyQualifiedName: "dropoffTimeEnd",
          values: ["2022-01-01T16:00:00Z"],
        },
      ],
    };

    const expectedTimeWindows = {
      pickupTime: {
        startsAt: new Date("2022-01-01T10:00:00Z").getTime(),
        endsAt: new Date("2022-01-01T12:00:00Z").getTime(),
      },
      dropoffTime: {
        startsAt: new Date("2022-01-01T14:00:00Z").getTime(),
        endsAt: new Date("2022-01-01T16:00:00Z").getTime(),
      },
    };

    const result = mapTimeWindows(kiboOrder);
    expect(result.pickupTime?.endsAt).toEqual(expectedTimeWindows.pickupTime?.endsAt);
    expect(result.pickupTime?.startsAt).toEqual(expectedTimeWindows.pickupTime?.startsAt);
    expect(result.dropoffTime?.endsAt).toEqual(expectedTimeWindows.dropoffTime?.endsAt);
    expect(result.dropoffTime?.startsAt).toEqual(expectedTimeWindows.dropoffTime?.startsAt);
    expect(result).toEqual(expectedTimeWindows);
  });

  test("should set default time windows if setDefaultValues is true", () => {
    const kiboOrder = {
      attributes: [  {
        fullyQualifiedName: "dropoffTimeStart",
        values: ["2022-01-01T14:00:00Z"],
      },
      {
        fullyQualifiedName: "dropoffTimeEnd",
        values: ["2022-01-01T16:00:00Z"],
      },],
    };

    const now = new Date().getTime();
    const expectedTimeWindows = {
      pickupTime: {
        startsAt: now,
        endsAt: now + 1000 * 60 * 60 * 24,
      },
      dropoffTime: {
        startsAt: new Date("2022-01-01T14:00:00Z").getTime(),
        endsAt: new Date("2022-01-01T16:00:00Z").getTime(),
      },
    };

    const result = mapTimeWindows(kiboOrder, true);

    expect(result.dropoffTime).toEqual(expectedTimeWindows.dropoffTime);

    expect(result.pickupTime).not.toEqual(null);
    expect(result.pickupTime).not.toEqual(undefined);

  });

  test("should return empty time windows if no attributes are provided", () => {
    const kiboOrder: { attributes: { fullyQualifiedName: string, values: string[] }[] } = {
      attributes: [],
    };

    const expectedTimeWindows = {};

    const result = mapTimeWindows(kiboOrder,false);

    expect(result).toEqual(expectedTimeWindows);
  });
});