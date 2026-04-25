<script lang="ts">
    const {
        data,
        keys,
    }: {
        data: (string | number)[][];
        keys: string[];
    } = $props();
</script>

<table class="w-full table-fixed">
    <thead>
        <tr class="w-full border-2 border-(--fff25)">
            {#each keys as key, i (i)}
                <th class="bg-(--blk) p-4 text-left font-semibold">{key}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as value, idx (idx)}
            <tr class="border-2 border-(--fff25)">
                {#each value as val, i (i)}
                    {#if i == 0}<td class="w-1/2 p-4 text-left">{val}</td>{:else}
                        <td class="w-1/2 p-4 text-left font-mono! text-(--accent)"
                            >{typeof val === "number" && !Number.isInteger(val)
                                ? val.toFixed(2)
                                : val}</td
                        >{/if}
                {/each}
            </tr>{/each}
    </tbody>
</table>
