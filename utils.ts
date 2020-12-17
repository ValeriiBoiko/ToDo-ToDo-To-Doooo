import { Dimensions } from "react-native"

const basicWidth = 375;
const screenWidth = Dimensions.get('window').width;

function widthDependedPixel(pixel: number): number {
  return (basicWidth / screenWidth) * pixel;
}

export {
  widthDependedPixel as wp
};
