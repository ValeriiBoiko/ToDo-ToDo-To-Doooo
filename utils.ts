import { Dimensions } from "react-native"

const basicWidth = 375;
const screenWidth = Dimensions.get('window').width;

function widthDependedPixel(pixel: number): number {
  return (screenWidth / basicWidth) * pixel;
}

function widthPercentageToDp(percentage: number): number {
  return basicWidth * (percentage / 100);
}

export {
  widthDependedPixel as wp,
  widthPercentageToDp as wpdp
};
