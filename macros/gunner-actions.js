let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Gunnery",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

let form = `
    <h3>Gunner Actions</h3>
    <br/>
    <b>Starship Part:</b> Weapons
    <br/>
    <b>Allowed Skills:</b> Piloting, Computers, Athletics, Mysticism
    <br/>
    <b>Allowed Roles:</b> Gunner, Operator, Auto-Pilot
    <br/><br/>
    Gunners use their actions to fire the starship’s weapons at their enemies.
    <br/>
    Gunners make attacks using Gunnery checks versus the target’s Armor Class (AC) for direct-fire weapons, or Target Lock (TL) for tracking weapons.
    <br/><br/>
    <form>
        <div class='form-group'>
            <label>Skill Modifier</label>
            <input type='number' name='modifier'></input>
        </div>
        <div class='form-group'>
            <label>Bonus</label>
            <input type='number' name='bonus' value=0></input>
        </div>
        <div class='form-group'>
            <label>Action</label>
            <select name='action' id='gunner-action'>
                <option value='shoot'>Shoot</option>
                <option value='launch'>Launch</option>
                <option value='manipulate'>Manipulate</option>
                <option value='fire-at-will'>Fire at Will</option>
                <option value='rapid-fire'>Rapid-Fire</option>
                <option value='broadside'>Broadside</option>
                <option value='perfect-shot'>Perfect Shot</option>
            </select>
        </div>
    </form>
    <br/>
    <table width='100%'>
        <tr>
            <th>Action</th>
            <th>Penalty</th>
            <th>Effect</th>
        </tr>
        <tr>
            <td style="text-align:center">Shoot</td>
            <td style="text-align:center"></td>
            <td style="text-align:center">Attack with a direct-fire weapon</td>
        </tr>
        <tr>
            <td style="text-align:center">Launch</td>
            <td style="text-align:center"></td>
            <td style="text-align:center">Attack with a tracking weapon</td>
        </tr>
        <tr>
            <td style="text-align:center">Manipulate</td>
            <td style="text-align:center"></td>
            <td style="text-align:center">Use a manipulator arm</td>
        </tr>
        <tr>
            <td style="text-align:center">Fire at Will</td>
            <td style="text-align:center">-4</td>
            <td style="text-align:center">Attack with two weapons</td>
        </tr>
        <tr>
            <td style="text-align:center">Rapid-Fire</td>
            <td style="text-align:center">-6</td>
            <td style="text-align:center">Attack twice with one weapon</td>
        </tr>
        <tr>
            <td style="text-align:center">Broadside</td>
            <td style="text-align:center">-8</td>
            <td style="text-align:center">Attack with many weapons</td>
        </tr>
        <tr>
            <td style="text-align:center">Perfect Shot</td>
            <td style="text-align:center">-15</td>
            <td style="text-align:center">Attack deals double damage and cause a random Critical Effect</td>
        </tr>
    </table>
    <br/>
`

let roll = (html) => {
    var mod = html.find('[name="modifier"]')[0].value
    var bonus = html.find('[name="bonus"]')[0].value
    var action = html.find('[name="action"]')[0].value
    // time to roll
    var penalty=0
    switch(action){
        case 'fire-at-will':
            penalty = -4
            break
        case 'rapid-fire':
            penalty = -6
            break
        case 'broadside':
            penalty = -8
            break
        case 'perfect-shot':
            penalty = -15
            break
    }
    var roll = new Roll(`d20 + @mod + @bonus + @penalty`,{mod:mod,bonus:bonus,penalty:penalty}).roll();
    // determine the action
    console.log(action)
    var type, message = ""
    switch (action){
        case "shoot":
            type = "Shoot"
            message = `
            <b>Power Cost:</b> Varies by weapon
            <br/><br/>
            You fire at a target using one of your starship’s direct-fire weapons. Choose a direct-fire weapon that has not been used this turn, then choose a target and roll a Gunnery check.
            <br/><br/>
            <b>Gunnery DC</b> = Target’s AC
            <br/><br/>
            <b>Success:</b> Your weapon hits the target, dealing damage and activating any special effects.
            <br/><br/>
            <b>Critical Success:</b> If the weapon deals damage, it deals double damage instead. If this hit dealt hull damage, the target also suffers from a random Critical Effect.
            <br/><br/>
            <b>Failure:</b> You deal no damage to the target.
            `
            break
        case "launch":
            type = "Launch"
            message = `
            <b>Power Cost:</b> Varies by weapon
            <br/><br/>
            You fire a projectile at a target using one of your starship’s tracking weapons. Choose a target and a tracking weapon that has not been used this turn. You create a new projectile in your ship’s space, and then roll a Gunnery check.
            <br/><br/>
            <b>Gunnery DC</b> = Target’s TL
            <br/><br/>
            <b>Success:</b> You move the projectile up to its speed. If it reaches the target’s space, it deals damage and activates any special effects.
            <br/><br/>
            <b>Critical Success:</b> Same as success, but you can move the projectile up to its speed plus 1 instead. If it reaches the target’s space and deals damage, it deals double damage instead. If this hit dealt hull damage, the target also suffers from a random Critical Effect.
            <br/><br/>
            <b>Failure:</b> The projectile loses its target and discharges harmlessly, destroying itself in the process.
            <br/><br/>
            <b>Ongoing:</b> At the start of your ship’s turn, you can quickly guide active projectiles without using an action. Reroll this Gunnery check for each projectile in play, taking a cumulative -2 penalty for each projectile after the first, and following the same success, critical success, and failure conditions of this action. You can select a different target each time you roll this check for a projectile. If a projectile has no target, or if you choose not to continue rolling for a projectile, it automatically fails this check and destroys itself.
            `
            break
        case "manipulate":
            type = 'Manipulate'
            message = `
            <b>Requirements:</b> A manipulator arm.
            <br/><br/>
            Use one of your starship’s manipulator arms to interact with the environment. An empty manipulator arm can draw and stow weapons from pack mounts, pick up and drop objects in the environment, and so on. Attacking with a held item is typically a Shoot or Launch action instead.
            <br/>
            Wielding a light weapon requires one manipulator arm, and wielding a heavy weapon requires two manipulator arms.
            <br/>
            Manipulating most objects is a DC 10 Gunnery check (or a Gunnery check versus their AC, if mobile), and you can manipulate multiple objects simultaneously by adding 5 per arm required to the Gunnery DC (for example, to draw two weapons at once). Conversely, using multiple manipulator arms to interact with one object reduces the DC by 2 per additional arm after the first.
            `
            break
        case "fire-at-will":
            type = "Fire at Will"
            message = `
            <b>Power Cost:</b> Varies by weapon
            <br/><br/> You attack with two weapons simultaneously. Choose two different weapons that have not been used this turn, and a target. Make one attack with each weapon (using  the Shoot or Launch actions) against the same target. Each attack is made with a -4 penalty to hit.
            `
            break
        case 'rapid-fire':
            type = "Rapid-Fire"
            message = `
            <b>Power Cost:</b> Varies by weapon
            <br/><br/>
            You rapidly fire a single weapon. Choose one weapon that has not been used this turn, and a target. Make two attacks (using the Shoot or Launch actions) against the same target. Each attack is made with a -6 penalty to hit.
            `
            break
        case 'broadside':
            type = 'Broadside'
            message = `
            <b>Requirements:</b> Character level 6th
            <br/><br/>
            <b>Power Cost:</b> Varies by weapon
            <br/><br/>
            You unleash a barrage of attacks on a single target, taking the Shoot or Launch actions with multiple weapons against a single target. You must use a different weapon for each attack, and all of them take a -8 penalty to hit. The number of weapons you can fire varies based on your ship size (see below).
            <br/>
            <table>
                <tr>
                    <th>Ship Size</th>
                    <th>Max Weapons</th>
                </tr>
                <tr>
                    <td>Tiny/Small</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>Medium/Large</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>Huge+</td>
                    <td>6</td>
                </tr>
            </table>
            `
            break
        case 'perfect-shot':
            type = 'Perfect Shot'
            message = `
            <b>Requirements:</b> Character level 12th
            <br/><br/>
            <b>Power Cost:</b> Varies by weapon
            <br/><br/>
            You attempt an extremely risky shot in hopes of striking a weak point. Take the Shoot or Launch actions with one weapon against a single target at a -15 penalty. If the shot hits during this turn, apply a random Critical Effect and double the total damage dealt (after accounting for crits).
            `
            break
    }
    

    toChat(`Rolling to ${type}!`, roll.result)
    toChat(message)

}
var applyChanges = false
let d = new Dialog({
title: "Roll Gunner Action",
content: form,
buttons: {
 one: {
  icon: '<i class="fas fa-dice-d20"></i>',
  label: "Roll",
  callback: () => applyChanges = true
 }
},
default: "one",
close: html => {
   if (applyChanges)
       roll(html)
}
});
d.render(true);