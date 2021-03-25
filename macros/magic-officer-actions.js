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
            flavor: "Magic",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

let form = `
    <h3>Magic Officer Actions</h3>
    <br/>
    <b>Allowed Skills:</b> Mysticism
    <br/>
    <b>Allowed Roles:</b> Magic Officer, Operator
    <br/><br/>
    Science Officer actions help gain valuable information.
    <br/>
    Magic Officers use their actions to build up mystical energy, then unleash it to create powerful effects. Most Magic Officer actions require Magic Points (MP) to activate. These behave much like PCU costs, but are consumed only after a successful check unless otherwise specified.
    <br/>
    Some Magic Officer actions have an Amplify effect. Before rolling a check for these actions, you can voluntarily spend additional Magic Points to increase the DC, but also increase the potential benefits.
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
            <select name='action' id='magic-officer-action'>
                <option value='focus'>Focus</option>
                <option value='scry'>Scry</option>
                <option value='eldritch-shot'>Eldritch Shot</option>
                <option value='prodigious-projectile'>Prodigious Projectile</option>
                <option value='disruptive-haze'>Disruptive Haze</option>
                <option value='detect-internal-comms'>Detect Internal Comms</option>
                <option value='galactic-gate'>Galactic Gate</option>
            </select>
        </div>
    </form>
    <br/>
    <table width='100%'>
        <tr>
            <th>Action</th>
            <th>DC</th>
            <th>MP</th>
            <th>Effect</th>
        </tr>
        <tr>
            <td style="text-align:center">Focus</td>
            <td style="text-align:center">8 +5/MP</td>
            <td style="text-align:center">-</td>
            <td style="text-align:center">Gain MP</td>
        </tr>
        <tr>
            <td style="text-align:center">Scry</td>
            <td style="text-align:center">TL +2/Amp</td>
            <td style="text-align:center">2 +1/Amp</td>
            <td style="text-align:center">Ask a question about the target (+1 question per Amplify)</td>
        </tr>
        <tr>
            <td style="text-align:center">Eldritch Shot</td>
            <td style="text-align:center">15 +5/Amp</td>
            <td style="text-align:center">1 +1/Amp</td>
            <td style="text-align:center">Boost the range of a direct-fire weapon by 1 (+1 range per Amplify)</td>
        </tr>
        <tr>
            <td style="text-align:center">Prodigious Projectile</td>
            <td style="text-align:center">TL +2/Amp</td>
            <td style="text-align:center">1 +1/Amp</td>
            <td style="text-align:center">Move a projectile half speed and bypass shields on hit (+1 movement per Amplify)</td>
        </tr>
        <tr>
            <td style="text-align:center">Disruptive Haze</td>
            <td style="text-align:center">15 +3/Amp</td>
            <td style="text-align:center">3 +1/Amp</td>
            <td style="text-align:center">Fill a space with obscuring haze for 1 round (+1 round or +1 space per Amplify)</td>
        </tr>
        <tr>
            <td style="text-align:center">Detect Internal Comms</td>
            <td style="text-align:center">TL</td>
            <td style="text-align:center">5</td>
            <td style="text-align:center">Hear internal ship communications</td>
        </tr>
        <tr>
            <td style="text-align:center">Galactic Gate</td>
            <td style="text-align:center">25 +5/Amp</td>
            <td style="text-align:center">06 +1/Amp</td>
            <td style="text-align:center">Teleport 3 spaces (+1 space per Amplify)</td>
        </tr>
    </table>
    <br/>
`

let roll = (html) => {
    var mod = html.find('[name="modifier"]')[0].value
    var bonus = html.find('[name="bonus"]')[0].value
    var action = html.find('[name="action"]')[0].value
    // time to roll
    var roll = new Roll(`d20 + @mod + @bonus`,{mod:mod,bonus:bonus}).roll();
    // determine the action
    console.log(action)
    var type, message = ""
    switch (action){
        case "focus":
            type = "Focus"
            message = `
            <b>Requirements:</b> 1 rank in Mysticism
            <br/><br/>
            You attempt to channel your magic powers into the starship’s circuitry. Choose a number of Magic Points (MP) to gain, then roll a Magic check.
            <br/><br/>
            <b>Magic DC</b> = 8 + 5 per MP desired
            <br/><br/>
            <b>Success:</b> Your starship gains the desired amount of MP.
            <br/><br/>
            <b>Failure:</b> You lose focus during the channeling process. Nothing happens.
            `
            break
        case "scry":
            type = "Scry"
            message = `
            <b>Requirements:</b> 1 rank in Mysticism
            <br/><br/>
            <b>MP Cost:</b> 2, +1 per Amplify
            <br/><br/>
            You transform a nearby screen into a scrying portal. Choose a target, then roll a Magic check.
            <br/><br/>
            <b>Magic DC</b> = Target’s TL + 2 per Amplify
            <br/><br/>
            <b>Success:</b> Ask a question about the target starship (or its parts or crew) whose answer would be yes or no, a number, a die formula, or a single word. The GM answers this question to the best of their knowledge. If the question has multiple answers, or if the answer is otherwise ambiguous, the GM may respond “unclear.” This is a divination effect.
            <br/><br/>
            <b>Amplify:</b> You may ask an additional question per Amplify.
            <br/><br/>
            <b>Failure:</b> Your scrying portal only provides blurry images and hissing static. Your questions are left unanswered.
            `
            break
        case "eldritch-shot":
            type = 'Eldritch Shot'
            message = `
            <b>Requirements:</b> 1 rank in Mysticism
            <br/><br/>
            <b>MP Cost:</b> 1, +1 per Amplify
            <br/><br/>
            You weave your mystic energies through the ammunition of a direct-fire weapon, attempting to increase its accuracy at range. Choose a direct-fire weapon, then roll a Magic check.
            <br/><br/>
            <b>Magic DC</b> = 15 + 5 per Amplify
            <br/><br/>
            <b>Success:</b> Until the start of your ship’s next turn, increase the weapon’s range by 1.
            <br/><br/>
            <b>Amplify:</b> Increase the weapon’s range by an additional 1 per Amplify.
            <br/><br/>
            <b>Failure:</b> Your alterations to the weapon causes its ammunition to discharge early. Reduce the range of the weapon by 1, and by an additional 1 per Amplify (to a minimum of range 0).
            `
            break
        case "prodigious-projectile":
            type = "Prodigious Projectile"
            message = `
            <b>Requirements:</b> 1 rank in Mysticism
            <br/><br/>
            <b>MP Cost:</b> 1, +1 per Amplify
            <br/><br/>
            You use your stored magic to help guide a missile to its target. Choose a target ship and an active projectile that your ship fired. Move the projectile up to half its speed, plus an additional space per Amplify. If the projectile would enter the space of the target, roll a Mysticism check.
            <br/><br/>
            <b>Magic DC</b> = Target’s TL + 2 per Amplify
            <br/><br/>
            <b>Success:</b> The projectile hits the target, dealing damage directly to the target’s hull, bypassing shields.
            <br/><br/>
            <b>Failure:</b> Your guidance falls short, and the projectile harmlessly disintegrates. You lose 1 MP.
            `
            break
        case 'disruptive-haze':
            type = "Disruptive Haze"
            message = `
            <b>Requirements:</b> 1 rank in Mysticism
            <br/><br/>
            <b>MP Cost:</b> 3, +1 per Amplify
            <br/><br/>
            You call forth fields of magical static that obscure space. Roll a Magic check.
            <br/><br/>
            <b>Magic DC</b> = 15 + 3 per Amplify
            <br/><br/>
            <b>Success:</b> Your fill your space, or an adjacent unoccupied space, with mystic haze that lasts until the start of your next turn. Projectiles that begin in or pass through this haze have a 50% chance of self-destructing instantly. Any targeted action with a line of sight that passes through the haze takes a -1 penalty. You cannot put haze in a space that already has active haze.
            <br/><br/>
            <b>Amplify:</b> For each Amplify, do one of the following: choose an additional unoccupied, adjacent space (or your current space) to fill with haze, increase the total duration by 1 round, or increase the penalty by 1.
            <br/><br/>
            <b>Failure:</b> The wisps of static you conjure are too thin to affect anything. Nothing happens.
            `
            break
        case 'detect-internal-comms':
            type = 'Detect Internal Comms'
            message = `
            <b>Requirements:</b> 6 ranks in Mysticism
            <br/><br/>
            <b>MP Cost:</b> 5
            <br/><br/>
            You magically alter your ship’s radio systems to pick up internal comms chatter of another starship. Choose a target, then roll a Magic check.
            <br/><br/>
            <b>Magic DC</b> = Target’s TL
            <br/><br/>
            <b>Success:</b> Until the start of your ship’s next turn, you can hear and record some internal communications from the ship’s bridge (or equivalent command center). The exact amount of information your ship hears is up to your GM, but it is typically muffled and filled with static, so details can be hard to process. During the target’s turn, as long as one of your crew can understand that their comms language, you learn the exact actions taken by the target ship’s crew.
            <br/><br/>
            <b>Failure:</b> All you hear is faint static. Nothing happens.
            `
            break
        case 'galactic-gate':
            type = 'Galactic Gate'
            message = `
            <b>Requirements:</b> 12 ranks in Mysticism
            <br/><br/>
            <b>MP Cost:</b> 6, +1 per Amplify
            <br/><br/>
            You attempt to form a portal of mystical energy large enough for your starship to pass through. Roll a Magic check.
            <br/><br/>
            <b>Magic DC</b> = 25 + 5 per Amplify
            <br/><br/>
            <b>Success:</b> You teleport your ship up to 3 spaces in any direction. This does not count as movement (for the purposes of actions like Engineer’s Emergency Repairs), and does not provoke attacks of opportunity.
            <br/><br/>
            <b>Amplify:</b> Increase the teleport distance by 1 space per Amplify.
            <br/><br/>
            <b>Failure:</b> You fail to maintain the gate long enough for it to transport you anywhere. Nothing happens.
            `
            break
    }
    

    toChat(`Rolling to ${type}!`, roll.result)
    toChat(message)

}
var applyChanges = false
let d = new Dialog({
title: "Roll Magic Officer Action",
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