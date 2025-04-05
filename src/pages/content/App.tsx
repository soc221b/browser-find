import _Find from "./components/_Find";
import _HotKey from "./components/_HotKey";
import _StyleSheet from "./components/_StyleSheet";
import Close from "./components/Close";
import FindNext from "./components/FindNext";
import FindPrevious from "./components/FindPrevious";
import Input from "./components/Input";
import Result from "./components/Result";
import ToggleMatchCase from "./components/ToggleMatchCase";
import ToggleMatchWholeWord from "./components/ToggleMatchWholeWord";
import ToggleUseRegularExpression from "./components/ToggleUseRegularExpression";
import Tooltip from "./components/Tooltip";
import useInert from "./hooks/use-inert";
import useMakeSelection from "./hooks/use-make-selection";

export default function App(): React.JSX.Element {
  useMakeSelection();

  const inert = useInert();

  return (
    <div className="root" inert={inert}>
      <Input></Input>
      <Result></Result>
      <ToggleMatchCase></ToggleMatchCase>
      <ToggleMatchWholeWord></ToggleMatchWholeWord>
      <ToggleUseRegularExpression></ToggleUseRegularExpression>
      <FindPrevious></FindPrevious>
      <FindNext></FindNext>
      <Close></Close>

      <Tooltip></Tooltip>

      <_HotKey></_HotKey>
      <_StyleSheet></_StyleSheet>
      <_Find></_Find>
    </div>
  );
}
