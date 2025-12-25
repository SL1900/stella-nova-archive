import { ChevronDown, ChevronUp } from "lucide-react";
import type {
  ItemData,
  ItemDataFraction,
} from "../../../scripts/structs/item-data";
import { tags, filterTags } from "../../../scripts/structs/tag-data";
import Collapsible from "../../common/collapsible";
import Dropdown from "../../common/dropdown";
import TextBox from "../../common/text-box";

const ImageMetadata = ({
  item,
  applyItem,
}: {
  item: ItemData | null;
  applyItem: (newI: ItemDataFraction) => void;
}) => {
  return (
    <>
      <Collapsible
        title={"Image Data"}
        icon={{
          open: <ChevronDown height={16} />,
          close: <ChevronUp height={16} />,
        }}
        fontSize={14}
        lock={{ setCollapsed: false }}
      >
        <div className="group-selectable grid grid-cols-[1fr_1fr] auto-rows-[minmax(30px,auto)] gap-1 px-1">
          <span className="text-sm flex items-center">Id</span>
          <TextBox
            text={item?.id ?? "< null >"}
            edit={{ placeholder: "newItem" }}
            setText={(s) => applyItem({ id: s.toString() })}
          />
          <span className="text-sm flex items-center">Type</span>
          <Dropdown
            options={["image"]}
            select={item?.type}
            setSelect={(s) => applyItem({ type: s.toString() })}
          />
          <span className="text-sm flex items-center">Category</span>
          <Dropdown
            options={(() => {
              let options: string[] = [];
              tags.forEach((t) => {
                if (t.level === "primary") options = t.tag;
              });
              return options;
            })()}
            select={item?.category}
            setSelect={(s) =>
              applyItem({
                category: s.toString(),
                sub_category: (() => {
                  let options: string[] = [];
                  filterTags.forEach((t) => {
                    if (t.main === item?.category && t.sub.length > 0)
                      options = t.sub;
                  });
                  return [options[0] ?? "< null >"];
                })(),
              })
            }
          />
          <span className="text-sm flex items-center">Sub-Category</span>
          <Dropdown
            options={(() => {
              let options = ["none"];
              filterTags.forEach((t) => {
                if (t.main === item?.category && t.sub.length > 0)
                  options = t.sub;
              });
              return options;
            })()}
            select={
              item && item.sub_category.length > 0
                ? item.sub_category[0]
                : undefined
            }
            setSelect={(s) => applyItem({ sub_category: [s.toString()] })}
          />
          <span className="text-sm flex items-center">Title</span>
          <TextBox
            text={item?.title ?? "< null >"}
            edit={{ placeholder: "< null >" }}
            setText={(s) => applyItem({ title: s.toString() })}
          />
          <span className="text-sm flex items-center">Description</span>
          <TextBox
            text={item?.description ?? "< null >"}
            edit={{ placeholder: "< null >" }}
            setText={(s) => applyItem({ description: s.toString() })}
          />
        </div>
      </Collapsible>

      <Collapsible
        title={"Metadata"}
        icon={{
          open: <ChevronDown height={16} />,
          close: <ChevronUp height={16} />,
        }}
        fontSize={14}
        lock={{ setCollapsed: false }}
      >
        <div className="group-selectable grid grid-cols-[1fr_1fr] auto-rows-[minmax(30px,auto)] gap-1 px-1">
          <span className="text-sm flex items-center">Width</span>
          <TextBox
            text={item?.meta.width.toString() ?? "< null >"}
            edit={{
              placeholder: "0",
              check: (s) => {
                const regex = /^[0-9\b]+$/;
                return regex.test(s);
              },
              checkFinal: (s) => {
                return Math.max(
                  0,
                  Math.min(Number.MAX_SAFE_INTEGER, Number(s))
                ).toString();
              },
            }}
            setText={(s) => {
              if (!item) return;
              applyItem({
                meta: {
                  ...item.meta,
                  width: Number(s.toString()),
                },
              });
            }}
          />
          <span className="text-sm flex items-center">Height</span>
          <TextBox
            text={item?.meta.height.toString() ?? "< null >"}
            edit={{
              placeholder: "0",
              check: (s) => {
                const regex = /^[0-9\b]+$/;
                return regex.test(s);
              },
              checkFinal: (s) => {
                return Math.max(
                  0,
                  Math.min(Number.MAX_SAFE_INTEGER, Number(s))
                ).toString();
              },
            }}
            setText={(s) => {
              if (!item) return;
              applyItem({
                meta: {
                  ...item.meta,
                  height: Number(s.toString()),
                },
              });
            }}
          />
          <span className="text-sm flex items-center">Version</span>
          <TextBox
            text={item?.meta.version ?? "< null >"}
            edit={{
              placeholder: "0.0.0",
              check: (s) => {
                const regex = /^[0-9\b\.]+$/;
                const arr = s.split(".");
                return regex.test(s) && arr.length < 4 && s.indexOf("..") == -1;
              },
              checkFinal: (s) => {
                if (s.charAt(0) == ".") s = "0" + s;
                if (s.charAt(s.length - 1) == ".") s = s + "0";

                if (s.split(".").length < 2) s = s + ".0";
                if (s.split(".").length < 3) s = s + ".0";

                return s;
              },
            }}
            setText={(s) => {
              if (!item) return;
              applyItem({
                meta: {
                  ...item.meta,
                  version: s.toString(),
                },
              });
            }}
          />
        </div>
      </Collapsible>
    </>
  );
};

export default ImageMetadata;
