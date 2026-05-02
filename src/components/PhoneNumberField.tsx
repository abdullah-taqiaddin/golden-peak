"use client";

type CountryOption = {
  code: string;
  label: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "+962", label: "الأردن (+962)" },
  { code: "+966", label: "السعودية (+966)" },
  { code: "+971", label: "الإمارات (+971)" },
  { code: "+965", label: "الكويت (+965)" },
  { code: "+974", label: "قطر (+974)" },
  { code: "+973", label: "البحرين (+973)" },
  { code: "+968", label: "عُمان (+968)" },
  { code: "+20", label: "مصر (+20)" },
  { code: "+1", label: "الولايات المتحدة (+1)" }
];

function toDigits(value: string) {
  return value.replace(/\D/g, "");
}

type PhoneNumberFieldProps = {
  countryCode: string;
  localNumber: string;
  onCountryCodeChange: (value: string) => void;
  onLocalNumberChange: (value: string) => void;
  required?: boolean;
  selectClassName: string;
  inputClassName: string;
};

export function PhoneNumberField({
  countryCode,
  localNumber,
  onCountryCodeChange,
  onLocalNumberChange,
  required = true,
  selectClassName,
  inputClassName
}: PhoneNumberFieldProps) {
  return (
    <div className="space-y-1">
      <span className="text-sm text-slate-300">رقم الهاتف</span>
      <div className="flex sm:flex-row sm:flex-row-reverse gap-2 flex-col">
        <select
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          className={selectClassName}
          required={required}
        >
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          className={inputClassName}
          type="tel"
          inputMode="numeric"
          placeholder="7XXXXXXXX"
          value={localNumber}
          onChange={(event) => onLocalNumberChange(toDigits(event.target.value))}
          required={required}
        />
      </div>
      <p className="text-xs text-slate-400">
        أدخل الرقم بدون صفر البداية. مثال: 791234567
      </p>
    </div>
  );
}
