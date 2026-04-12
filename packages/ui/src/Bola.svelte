<script lang="ts">
    const { color, text, small } = $props<{
        color: "mas-o-menos" | "ocupado" | "disponible";
        text: string;
        small?: string;
    }>();

    const c = (a: boolean = true) =>
        color === "mas-o-menos"
            ? a
                ? "bg-[#ff8032]"
                : "text-[#ff8032]"
            : color === "ocupado"
              ? a
                  ? "bg-[#ff3232]"
                  : "text-[#ff3232]"
              : a
                ? "bg-(--accent)"
                : "text-(--accent)";
</script>

<div class="flex w-full flex-1 flex-row items-center justify-start gap-1">
    <div class="grid aspect-square h-6 place-items-center">
        <div
            class="aspect-square h-full rotate-45 motion-safe:animate-[bola-anim_2s_infinite_linear] {c()}"
        ></div>
    </div>
    <h2 class="{c(false)} font-normal">
        {text}
        {#if small}<span style="font-size: medium; font-weight: 600">({small})</span>{/if}
    </h2>
</div>
