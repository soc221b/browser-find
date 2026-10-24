import { useEffect, useState } from "react";

type Settings = {
  defaultUseRegularExpression: boolean;
};

const defaults: Settings = {
  defaultUseRegularExpression: false,
};

export default function OptionsApp(): React.JSX.Element {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(defaults, (result) => {
      setSettings(result as Settings);
      setLoaded(true);
    });
  }, []);

  function handleChange(update: Partial<Settings>) {
    const next = { ...settings, ...update };
    setSettings(next);
    chrome.storage.sync.set(next);
  }

  if (!loaded) return <></>;

  return (
    <div className="p-6 text-sm text-gray-800">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-4">
        <span className="text-right">Enable Regex search mode by default</span>
        <input
          type="checkbox"
          checked={settings.defaultUseRegularExpression}
          onChange={(e) => handleChange({ defaultUseRegularExpression: e.target.checked })}
          className="h-4 w-4 cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}
