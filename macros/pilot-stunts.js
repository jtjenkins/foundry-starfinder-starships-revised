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
            flavor: "Piloting",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

let form = `
    <h3>Pilot Stunt Check</h3>
    <b>Requirements:</b> 1 rank in Piloting
    <br/>
    Stunts are special types of Pilot actions a pilot can learn that provide benefits beyond the standard flying procedures.
    <br/>
    The first time a character puts a rank into Piloting and every 3 ranks thereafter (ranks 1, 4, 7, 10, 13, 16, and 19), they may choose a new stunt to learn as a Signature Stunt. As a pilot’s career goes on, they may shift their training focus from old tactics to new ones. Whenever you put a rank into the Piloting skill, you can swap out one Signature Stunt in exchange for a stunt you don’t know.
    <br/>
    Though most pilots stick to using the stunts they know, particularly daring (or desperate) pilots may take a risk on an unpracticed stunt. If you attempt to perform a stunt that isn’t one of your Signature Stunts, the DC increases by 5.
    <br/>
    Some pilots like to push their skills to the limit. Before attempting any Flight check to perform a Signature Stunt, you can voluntarily increase the DC by 10 to add the Breakthrough result on success.
    <br/><br/>
    <form>
        <div class='form-group'>
            <label>Piloting Modifier</label>
            <input type='number' name='modifier'></input>
        </div>
        <div class='form-group'>
            <label>Bonus</label>
            <input type='number' name='bonus' value=0></input>
        </div>
        <div class='form-group'>
            <label>Stunt</label>
            <select name='action' id='stunt-action'>
                <option value='roll'>Barrel Roll</option>
                <option value='escape'>Escape</option>
                <option value='evade'>Evade</option>
                <option value='flip'>Flip & Burn</option>
                <option value='flyby'>Flyby</option>
                <option value='jockey'>Jockey</option>
                <option value='ram'>Ram</option>
                <option value='throttle'>Reactive Throttle</option>
                <option value='spin'>Spin & Lock</option>
                <option value='strafe'>Strafe</option>
            </select>
        </div>
    </form>
    <br/>
    <table width='100%'>
        <tr>
            <th>Stunt</th>
            <th>DC</th>
            <th>PCU</th>
            <th>Summary</th>
        </tr>
        <tr>
            <td style="text-align:center">Barrel Roll</td>
            <td style="text-align:center">19</td>
            <td style="text-align:center">2</td>
            <td style="text-align:center">+1 to AC and TL vs one target</td>
        </tr>
        <tr>
            <td style="text-align:center">Escape</td>
            <td style="text-align:center">17</td>
            <td style="text-align:center">2</td>
            <td style="text-align:center">+2 to TL vs one target</td>
        </tr>
        <tr>
            <td style="text-align:center">Evade</td>
            <td style="text-align:center">18</td>
            <td style="text-align:center">2</td>
            <td style="text-align:center">+2 to AC vs one target</td>
        </tr>
        <tr>
            <td style="text-align:center">Flip & Burn</td>
            <td style="text-align:center">22</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">+1 to AC and TL</td>
        </tr>
        <tr>
            <td style="text-align:center">Flyby</td>
            <td style="text-align:center">22</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">Move half speed immediately, ignoring attacks of opportunity, then half speed again at the end of turn</td>
        </tr>
        <tr>
            <td style="text-align:center">Jockey</td>
            <td style="text-align:center">Varies</td>
            <td style="text-align:center">5</td>
            <td style="text-align:center">Force all combatants to reroll initiative at the end of the round</td>
        </tr>
        <tr>
            <td style="text-align:center">Ram</td>
            <td style="text-align:center">25</td>
            <td style="text-align:center">5</td>
            <td style="text-align:center">Move in a straight line, dealing major damage to one target and your own ship</td>
        </tr>
        <tr>
            <td style="text-align:center">Reactive Throttle</td>
            <td style="text-align:center">20</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">Ready your movement to use on an enemy's turn</td>
        </tr>
        <tr>
            <td style="text-align:center">Spin & Lock</td>
            <td style="text-align:center">22</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">+1 to all Gunnery checks for on crew member</td>
        </tr>
        <tr>
            <td style="text-align:center">Strafe</td>
            <td style="text-align:center">19</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">+2 to next Gunnery check vs one target</td>
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
        case "roll":
            type = "Barrel Roll"
            message = `
            <b>PCU Cost:</b> 2
            <br/>
            You attempt a combination roll and loop, throwing off an enemy’s aim. Choose a target, then roll a Flight check.
            <br/>
            <b>Flight DC:</b> 19 (24 unpracticed, 29 breakthrough)
            <br/>
            <b>Success:</b> You move your starship up to its speed and gain a +1 bonus to AC and TL versus the chosen target until the start of your ship’s next turn.
            <br/>
            <b>Breakthrough:</b> The AC and TL bonuses increase to +3.
            <br/>
            <b>Failure:</b> Your starship stalls out halfway through the loop, disorienting your crewmates. You move your starship up to half its speed (rounded down, minimum: 1). Your ship also takes a -4 penalty to the next crew action taken by anyone on your ship before the start of your ship’s next turn.
            `
            break
        case "escape":
            type = "Escape"
            message = `
            <b>PCU Cost:</b> 2
            <br/>
            You perform a string of calculated speed and angle adjustments dodge incoming tracking weapons. Choose a target, then roll a Flight check.
            <b>Flight DC:</b> 17 (22 unpracticed, 27 breakthrough)
            <br/>
            <b>Success:</b> You move your starship up to its speed and gain a +2 bonus to TL versus the chosen target until the start of your ship’s next turn.
            <br/>
            <b>Breakthrough:</b> The TL bonus increases to +4.
            <br/>
            <b>Failure:</b> You are unable to pull away from incoming projectiles. You move your starship up to its speed minus 1 and take a -1 penalty to TL until the start of your ship’s next turn.
            `
            break
        case "evade":
            type = 'Evade'
            message = `
            <b>PCU Cost:</b> 2
            <br/>
            You focus your attention on a particular enemy taking advantage of blind spots of their firing arcs. Choose a target, then roll a Flight check.
            <br/>
            <b>Flight DC:</b> 18 (23 unpracticed, 28 breakthrough)
            <br/>
            <b>Success:</b> You move your starship up to its speed and gain a +2 bonus to AC versus the chosen target until the start of your ship’s next turn.
            <br/>
            <b>Breakthrough:</b> The AC bonus increases to +4.
            <br/>
            <b>Failure:</b> Overwhelmed by incoming fire, you mistakenly drift right into your enemies’ line of fire. You move your starship up to its speed minus 1 and take a -1 penalty to AC until the start of your ship’s next turn.
            `
            break
        case "flip":
            type = "Flip & Burn"
            message = `
            <b>PCU Cost:</b> 4
            <br/>
            You cut your engines suddenly, flip your ship around an axis, then fire the engines up in the opposite direction, surprising and disorienting your enemies. You move your ship 1 space, then roll a Flight check.
            <br/>
            <b>Flight DC:</b> 22 (27 unpracticed, 32 breakthrough)
            <br/>
            <b>Success:</b> You move your starship up to its speed and gain a +1 bonus to AC and TL versus all enemies until the start of your ship’s next turn.
            <br/>
            <b>Breakthrough:</b> You move your starship up to its speed plus 1 instead, and the AC and TL bonuses increase to +2.
            <br/>
            <b>Failure:</b> You misjudge your thruster timings, causing theship to rocket off-course. You move your  starship up to half its speed (rounded down, minimum: 1) in a straight line. Your ship also takes a -4 penalty to Gunnery checks until the start of your ship’s next turn.
            `
            break
        case 'flyby':
            type = "Flyby"
            message = `
            <b>PCU Cost:</b> 4
            <br/>
            You maneuver your ship to take advantage of narrow windows of opportunity. You move your ship up to half its speed (rounded down, minimum: 1), then roll a Flight Check.
            <br/>
            <b>Flight DC:</b> 22 (27 unpracticed, 32 breakthrough)
            <br/>
            <b>Success:</b> Your movement does not provoke attacks of opportunity. At the end of your starship’s turn (after all other end of turn effects have been resolved), you move your ship up to half its speed (rounded up, minimum: 1). This additional movement also does not provoke attacks of opportunity.
            <br/>
            <b>Breakthrough:</b> Your ship gains a +1 bonus to all Gunnery checks until the end of your starship’s turn. You may also move 1 extra space during your additional end of turn movement.
            <br/>
            <b>Failure:</b> Your movement provokes attacks of opportunity (as normal), and your ship takes a -1 penalty to all Gunnery checks until the end of your ship’s turn.
            `
            break
        case 'jockey':
            type = 'Jockey'
            message = `
            <b>PCU Cost:</b> 5
            <br/>
            You search for a gap in your foes’ reaction times to put yourself in a more advantageous position. Choose one or more targets, then roll a Flight check.
            <br/>
            <b>Flight DC:</b> Highest current initiative count between the targets (+5 unpracticed, +10 breakthrough), +1 per target beyond the first
            <br/>
            <b>Success:</b> You move your starship up to its speed. At the end of the round, you and all targets reroll initiative and keep the new results.
            <br/>
            <b>Breakthrough:</b> Same as success, but you get a +1 to the initiative roll and can choose to keep the new result only if it is higher than your current result.
            <br/>
            <b>Failure:</b> You miss your opportunity to react. Your starship does not move. At the end of the round, your starship rerolls initiative with a -1 penalty and keep the result only if it is lower than your current initiative.
            `
            break
        case 'ram':
            type = 'Ram'
            message = `
            <b>PCU Cost:</b> 5
            <br/>
            Throwing caution to the wind, you attempt to ram your starship into your enemies. Move your ship up to its speed in a straight line, passing through the space of at least one enemy, then roll a Flight check.
            <br/>
            <b>Flight DC:</b> 25 (30 unpracticed, 35 breakthrough)
            <br/>
            <b>Success:</b> Your movement does not provoke attacks of opportunity. You deal damage directly to the hull of each enemy you pass through, in order, bypassing any shields. The damage dealt to each ship is based on your starship’s size (Tiny = 1d4x10, Small = 1d6x10, Medium = 1d8x10, Large = 1d10x10, Huge = 1d12x10, Gargantuan = 1d20x10, Colossal = 2d20x10, Supercolossal = 4d20x10). Your starship takes half the damage dealt to each enemy, directly to its hull, bypassing shields. Damage beyond the target’s remaining HP does not count as damage dealt for this stunt.
            <br/>
            <b>Breakthrough:</b> Same as success, but your ship takes one quarter of the total damage dealt instead of half.
            <br/>
            <b>Failure:</b> Same as success, but your movement provokes attacks of opportunity (as normal) and your ship takes damage equal to the total damage dealt instead of half.
            <br/>
            <b>Note:</b> If your starship runs out of Hull Points before all targets in its path of movement have been attacked, the stunt immediately ends. Your starship (or what remains of it) still ends up at the target destination, but no further damage is dealt to enemies.
            `
            break
        case 'throttle':
            type = "Reactive Throttle"
            message = `
            <b>PCU Cost:</b> 4
            <br/>
            You hold your position, waiting for the perfect time to activate your ship’s thrusters. Your ship does not move. Until the start of your next turn, you may roll a Flight check immediately before another ship performs an action.
            <br/>
            <b>Flight DC</b> 20 (25 unpracticed, 30 breakthrough)
            <br/>
            <b>Success:</b> You move your ship up to its speed (either before or after the triggering action completes, your choice). This movement ignores attacks of opportunity.
            <br/>
            <b>Breakthrough:</b> At the end of your movement, your starship can make one attack against the ship that triggered this action as if it had triggered an attack of opportunity.
            <br/>
            <b>Failure:</b> You fail to react in time, missing your window of opportunity. Your ship does not move.
            `
            break
        case 'spin':
            type = 'Spin & Lock'
            message = `
            <b>PCU Cost:</b> 4
            <br/>
            You hold the ship in place while using your thrusters to make small adjustments, rapidly realigning to face a series of targets at your gunner’s command. Choose a crew member on your ship.
            <br/>
            <b>Flight DC</b> 22 (27 unpracticed, 32 breakthrough)
            <br/>
            <b>Success:</b> Your ship does not move, but the chosen crew member gains a +1 bonus to all Gunnery checks until the start of your ship’s next turn.
            <br/>
            <b>Breakthrough:</b> The Gunnery bonus increases to +3 and applies to all crew members on your ship.
            <br/>
            <b>Failure:</b> Your ship spins uncontrollably, disorienting your fellow crew members. Your ship takes a -2 penalty to all crew member actions until the start of your ship’s next turn.
            `
            break
        case 'strafe':
            type = 'Strafe'
            message = `
            <b>PCU Cost:</b> 4
            <br/>
            You slide through space while keeping your forward arc focused on a specific point. Choose a target, then roll a Flight check.
            <br/>
            <b>Flight DC:</b> 19 (24 unpracticed, 29 breakthrough)
            <br/>
            <b>Success:</b> You move your starship up to its speed and gain a +2 bonus to the next Gunnery check versus the target before the end of your starship’s turn.
            <br/>
            <b>Breakthrough:</b> The bonus applies to all Gunnery checks versus the target until the end of your starship’s turn. Your ship also gains a +1 bonus to AC and TL versus the target until the start of your next turn.
            <br/>
            <b>Failure:</b> You over-rotate the ship, and have to engage emergency break thrusters to correct your course, creating an easily predictable flight path. You move your starship up to half its speed (rounded down, minimum: 1) and take a -2 penalty to AC and TL until the start of your ship’s next turn.
            `
            break
    }
    

    toChat(`Rolling to ${type} the ship!`, roll.result)
    toChat(message)

}
var applyChanges = false
let d = new Dialog({
title: "Roll Pilot Stunt Action",
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