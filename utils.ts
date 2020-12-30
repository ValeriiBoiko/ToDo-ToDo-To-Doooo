import { Dimensions } from "react-native"

const basicWidth = 375;
const { width, height } = Dimensions.get('window');
const screenWidth = height / width < 1.75 ? height / 1.75 : width;

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
