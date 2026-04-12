<script lang="ts">
    const { table } = $props<{
        table: [string, string | number][];
    }>();
</script>

<table class="w-full">
    <thead>
        <tr class="w-full border-2 border-(--fff25)">
            <th class="w-1/2 bg-(--blk) p-4 text-left font-semibold">Propiedad</th>
            <th class="w-1/2 bg-(--blk) p-4 text-left font-semibold">Valor</th>
        </tr>
    </thead>
    <tbody>
        {#each table as val, i (i)}
            <tr class="w-full border-2 border-(--fff25)">
                <td class="w-1/2 p-4 text-left">{val[0]}</td>
                <td class="w-1/2 p-4 text-left font-mono! text-(--accent)"
                    >{typeof val[1] === "number" ? val[1].toFixed(2) : val[1]}</td
                >
            </tr>{/each}
    </tbody>
</table>
