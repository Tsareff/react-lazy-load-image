import * as React from "react";
import { LazyImage } from "./index";
import { shallow, mount } from "enzyme";

const src1 = "/test/image1.png";
const src2 = "/test/image2.png";

test("should set correct initial state", () => {
  const wrapper = shallow(<LazyImage src={src1} />);

  expect(wrapper.state("src")).toEqual(src1);
});

test("should set correct initial src", () => {
  const wrapper = mount(<LazyImage src={src1} />);

  const imageElm = wrapper.instance().elmRef.current;

  expect(imageElm.getAttribute("src")).toEqual(src1);
});

test("should change src after update prop", () => {
  const wrapper = mount(<LazyImage src={src1} />);

  wrapper.setProps({ src: src2 });

  const imageElm = wrapper.instance().elmRef.current;

  expect(imageElm.getAttribute("src")).toEqual(src2);
});

test("should change state on component did update", () => {
  const wrapper = shallow(<LazyImage src={src1} />);

  wrapper.setProps({ src: src2 });

  expect(wrapper.state("src")).toEqual(src2);
});
