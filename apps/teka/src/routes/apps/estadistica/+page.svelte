<script lang="ts">/* THIS IS GENERATED CODE, built with the ZPWAPP engine. Look for a .ZPWAPP file one directory above with the same name as this directory, the code for this app is there.*/
import Core from "@zpw/ui/app/Core";
import Input from "@zpw/ui/Input";
let values: {pairs: [number, number][],test?: string} = $state({});

let i = 0;
const avg = 1.93;

const w: "DM" | "Varian" = "Varian" as "DM" | "Varian";

function calculatorMethod() {
  input.pairs.forEach((p) => {
    const a = w == "DM" ? Math.abs(p[0] - avg) : Math.pow(p[0] - avg, 2);
    i += a * p[1];
  });

  i = i / 74;
  console.log(i);
  if (w == "Varian") console.log(Math.sqrt(i));
}</script>
<Core bind:values {calculatorMethod}>
<Input
type='text'
title="test de ZPWAPP code-gen"
name="foo"
required={true}
bind:value={input.pairs}/>
</Core>