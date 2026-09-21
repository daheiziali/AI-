"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const priceConditions = [
  { value: "gte", label: "≥ 高于或等于" },
  { value: "lte", label: "≤ 低于或等于" },
  { value: "cross-up", label: "↑ 向上穿越" },
  { value: "cross-down", label: "↓ 向下穿越" },
] as const;

const changeConditions = [
  { value: "rise", label: "上涨达到" },
  { value: "fall", label: "下跌达到" },
] as const;

export function IndexAlertDialog({ name, value, unit }: { name: string; value: string; unit: string }) {
  const initialValue = value;
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<"price" | "change">("price");
  const [condition, setCondition] = useState("cross-up");
  const [target, setTarget] = useState(initialValue);
  const [pauseAfterTrigger, setPauseAfterTrigger] = useState(true);
  const conditions = mode === "price" ? priceConditions : changeConditions;
  const selectedLabel = conditions.find((item) => item.value === condition)?.label ?? conditions[0].label;
  const summary = useMemo(() => mode === "price"
    ? `${name} ${selectedLabel.replace(/^[≥≤↑↓]\s/, "")} ${target} ${unit}`
    : `${name} 近 7 日${selectedLabel} ${target}%`, [condition, mode, name, selectedLabel, target, unit]);

  const changeMode = (nextMode: string) => {
    const next = nextMode as "price" | "change";
    setMode(next);
    setCondition(next === "price" ? "cross-up" : "rise");
    setTarget(next === "price" ? initialValue : "5.0");
  };

  return (
    <Dialog onOpenChange={(open) => open && setSaved(false)}>
      <DialogTrigger asChild><Button className="alert-button"><Bell />设置预警</Button></DialogTrigger>
      <DialogContent className="alert-dialog">
        <DialogHeader><DialogTitle>设置{name}预警</DialogTitle><DialogDescription>指数满足条件时，通过你选择的方式提醒。</DialogDescription></DialogHeader>
        {saved ? <div className="alert-success"><Bell /><strong>预警已开启</strong><span>{summary}</span><small>{pauseAfterTrigger ? "触发一次后自动暂停" : "每次满足条件时提醒"}</small></div> : <div className="alert-form">
          <div className="alert-field"><span>预警类型</span><Tabs className="alert-type-tabs" value={mode} onValueChange={changeMode}><TabsList><TabsTrigger value="price">价格阈值</TabsTrigger><TabsTrigger value="change">7日涨跌幅</TabsTrigger></TabsList></Tabs></div>
          <label className="alert-field">触发条件<div className="alert-condition-row">
            <Select value={condition} onValueChange={setCondition}><SelectTrigger aria-label="选择触发条件"><SelectValue /></SelectTrigger><SelectContent>{conditions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
            <div className="alert-target"><Input value={target} onChange={(event) => setTarget(event.target.value)} inputMode="decimal" aria-label="预警目标值" /><span>{mode === "price" ? unit : "% / 7D"}</span></div>
          </div><small>{mode === "price" ? "“穿越”仅在指数从阈值一侧越过时触发，适合避免连续重复提醒。" : "按最近 7 个更新日的累计涨跌幅计算。"}</small></label>
          <label className="switch-row"><span><strong>触发一次后暂停</strong><small>需要时可在预警列表中重新启用</small></span><Switch checked={pauseAfterTrigger} onCheckedChange={setPauseAfterTrigger} /></label>
          <label className="switch-row"><span><strong>App 推送</strong><small>指数更新后发送</small></span><Switch defaultChecked /></label>
        </div>}
        <DialogFooter>{!saved && <Button onClick={() => setSaved(true)}>保存预警</Button>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
