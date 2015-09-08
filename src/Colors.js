var Colors = {

    BACKGROUND_COLOR: "#394046",
    MENU_HOVER: "#fda900",
    TEXT_COLOR: "#ffffff",
    ALERT_HOVER: "#373d43",
    ALERT_BACKGROUND: "#515b63",
    ALERT_INNER_BORDER: "#2f352e",
    ALERT_OUTER_BORDER: "#252a25",
    ALERT_BUTTON_BACKGORUND: "#434b52",
    CREDITS_LINK: "#365ec4",
    CREDITS_HOVER: "#80a0fe",
    TOOLTIPS_BACKGROUND: "",
    TOOLTIPS_COLOR: ""
};

Colors.parseFromString = function(color) {
  var colorObject = {r: 0, g: 0, b: 0};
  colorObject.r = parseInt(color.substring(1, 3), 16);
  colorObject.g = parseInt(color.substring(3, 5), 16);
  colorObject.b = parseInt(color.substring(5, 7), 16);
  return colorObject;
}
