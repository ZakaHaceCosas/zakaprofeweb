<script lang="ts">
    export let table: [string, string | number][];
    export let channel: "ZakaProfe" | "ZakaTeka";
</script>

<table class="w-full">
    <thead>
        <tr class="w-full border-2 border-(--fff25)">
            <th class="w-1/2 bg-(--blk) p-4 text-left font-semibold">Propiedad</th>
            <th class="w-1/2 bg-(--blk) p-4 text-left font-semibold">Valor</th>
        </tr>
    </thead>
    <tbody>
        {#each table as val}
            <tr class="w-full border-2 border-(--fff25)">
                <td class="w-1/2 p-4 text-left">{val[0]}</td>
                <td
                    class={"w-1/2 p-4 text-left font-mono! "
                        + (channel === "ZakaProfe" ? "text-(--ZakaProfe)" : "text-(--ZakaTeka)")}
                    >{val[1]}</td
                >
            </tr>{/each}
    </tbody>
</table>
